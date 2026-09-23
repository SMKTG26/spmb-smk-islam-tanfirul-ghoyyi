import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_ACTIVITY_VIDEOS } from '../data/mockData';
import { ActivityVideoItem } from '../types/spmb';
import { 
  getAllVideos, 
  saveVideoItem, 
  deleteVideoItem, 
  resetVideosToDefault, 
  extractVideoMeta 
} from '../utils/videoStorage';
import { 
  Play, 
  Film, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Upload, 
  Video as VideoIcon, 
  Check, 
  X, 
  Clock, 
  Calendar, 
  Tag, 
  Sparkles, 
  ExternalLink,
  BookOpen,
  Camera,
  Share2,
  AlertCircle,
  Loader2
} from 'lucide-react';

// Helper to convert YouTube URL to embed URL
export const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  const trimmed = url.trim();

  // If already embed URL
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed;
  }

  // youtu.be/<id>
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&rel=0`;
  }

  // youtube.com/watch?v=<id>
  const longMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (longMatch && longMatch[1]) {
    return `https://www.youtube.com/embed/${longMatch[1]}?autoplay=1&rel=0`;
  }

  // youtube.com/shorts/<id>
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&rel=0`;
  }

  return null;
};

export const ActivityVideosSection: React.FC = () => {
  const [videos, setVideos] = useState<ActivityVideoItem[]>(INITIAL_ACTIVITY_VIDEOS);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activePlayingVideo, setActivePlayingVideo] = useState<ActivityVideoItem | null>(null);

  // Success / Notice toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit / Add Modal state
  const [editingVideo, setEditingVideo] = useState<ActivityVideoItem | null>(null);
  const [isNewVideo, setIsNewVideo] = useState<boolean>(false);
  const [formData, setFormData] = useState<ActivityVideoItem | null>(null);
  const [pendingVideoFile, setPendingVideoFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  // Fast direct video replace from card
  const directVideoInputRef = useRef<HTMLInputElement>(null);
  const [directTargetVideoId, setDirectTargetVideoId] = useState<string | null>(null);

  // Modal file input refs
  const modalVideoInputRef = useRef<HTMLInputElement>(null);
  const modalThumbInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  };

  // Load videos on mount from IndexedDB
  useEffect(() => {
    let isMounted = true;
    getAllVideos().then((loaded) => {
      if (isMounted) {
        if (loaded && loaded.length > 0) {
          setVideos(loaded);
        }
        setLoading(false);
      }
    }).catch((err) => {
      console.error(err);
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle direct file replacement on card
  const triggerDirectUpload = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDirectTargetVideoId(id);
    directVideoInputRef.current?.click();
  };

  const handleDirectFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && directTargetVideoId) {
      const targetItem = videos.find((v) => v.id === directTargetVideoId);
      if (!targetItem) return;

      setIsProcessingFile(true);
      showToast(`Sedang memproses & menyimpan video "${file.name}"...`);

      try {
        const { thumbnailDataUrl, durationFormatted } = await extractVideoMeta(file);

        const updatedItem: ActivityVideoItem = {
          ...targetItem,
          duration: durationFormatted || targetItem.duration,
          thumbnailUrl: thumbnailDataUrl || targetItem.thumbnailUrl,
          dateAdded: new Date().toISOString().split('T')[0],
        };

        const saved = await saveVideoItem(updatedItem, file);
        setVideos((prev) => prev.map((v) => (v.id === saved.id ? saved : v)));

        showToast(`Video "${saved.title}" berhasil diunggah dan disimpan!`);
      } catch (err) {
        console.error('Failed to save direct video:', err);
        alert('Gagal mengunggah video. Pastikan format berkas video didukung (.mp4, .webm).');
      } finally {
        setIsProcessingFile(false);
      }
    }
    e.target.value = '';
    setDirectTargetVideoId(null);
  };

  // Open Create Modal
  const handleAddNewVideo = () => {
    setIsNewVideo(true);
    const newVid: ActivityVideoItem = {
      id: `vid-${Date.now()}`,
      title: '',
      category: 'Lalaran Alfiyah',
      videoUrl: '',
      thumbnailUrl: '/video_lalaran_alfiyah.jpg',
      duration: '03:00',
      dateAdded: new Date().toISOString().split('T')[0],
      description: '',
      speakerOrLead: 'Santri & Asatidz SMK TANGO',
      tags: ['Kegiatan Santri', 'SMK Tanfirul Ghoyyi'],
    };
    setPendingVideoFile(null);
    setEditingVideo(newVid);
    setFormData(newVid);
  };

  // Open Edit Modal
  const handleEditVideo = (vid: ActivityVideoItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsNewVideo(false);
    setPendingVideoFile(null);
    setEditingVideo(vid);
    setFormData({ ...vid });
  };

  // Delete video
  const handleDeleteVideo = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Apakah Anda yakin ingin menghapus video kegiatan ini?')) {
      try {
        await deleteVideoItem(id);
        setVideos((prev) => prev.filter((v) => v.id !== id));
        if (activePlayingVideo?.id === id) {
          setActivePlayingVideo(null);
        }
        showToast('Video berhasil dihapus.');
      } catch (err) {
        console.error(err);
        alert('Gagal menghapus video.');
      }
    }
  };

  // Reset to default
  const handleResetDefault = async () => {
    if (window.confirm('Kembalikan semua daftar video ke data bawaan awal SMK Islam Tanfirul Ghoyyi?')) {
      try {
        const resetList = await resetVideosToDefault();
        setVideos(resetList);
        setActivePlayingVideo(null);
        showToast('Video berhasil dikembalikan ke pengaturan default.');
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Form submit in Modal
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    if (!formData.title.trim()) {
      alert('Mohon isi judul video kegiatan terlebih dahulu.');
      return;
    }

    setSaveLoading(true);
    try {
      const saved = await saveVideoItem(formData, pendingVideoFile);
      
      if (isNewVideo) {
        setVideos((prev) => [saved, ...prev]);
        showToast(`Video baru "${saved.title}" berhasil ditambahkan!`);
      } else {
        setVideos((prev) => prev.map((v) => (v.id === saved.id ? saved : v)));
        showToast(`Perubahan video "${saved.title}" berhasil disimpan!`);
      }

      if (activePlayingVideo?.id === saved.id) {
        setActivePlayingVideo(saved);
      }

      setEditingVideo(null);
      setFormData(null);
      setPendingVideoFile(null);
    } catch (err) {
      console.error('Error saving video:', err);
      alert('Terjadi kesalahan saat menyimpan video. Silakan coba lagi.');
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle video file chosen in modal
  const handleModalVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && formData) {
      setIsProcessingFile(true);
      try {
        setPendingVideoFile(file);
        
        // Extract live duration and auto-thumbnail
        const { thumbnailDataUrl, durationFormatted } = await extractVideoMeta(file);

        // Create temporary blob URL for instant preview inside modal
        const previewUrl = URL.createObjectURL(file);

        setFormData({
          ...formData,
          videoUrl: previewUrl,
          duration: durationFormatted || formData.duration,
          thumbnailUrl: thumbnailDataUrl || formData.thumbnailUrl,
        });

        showToast(`Berkas video "${file.name}" siap disimpan!`);
      } catch (err) {
        console.error('Error extracting video meta:', err);
      } finally {
        setIsProcessingFile(false);
      }
    }
  };

  // Handle custom thumbnail chosen in modal
  const handleModalThumbFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && formData) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setFormData({ ...formData, thumbnailUrl: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = ['Semua', 'Lalaran Alfiyah', 'Praktek DKV', 'Tahfidz Al-Qur\'an', 'English Class', 'Ekstrakurikuler'];

  const filteredVideos = selectedCategory === 'Semua'
    ? videos
    : videos.filter((v) => v.category === selectedCategory);

  const isDirectVideoUrl = (url: string) => {
    if (!url) return false;
    return (
      url.startsWith('blob:') ||
      url.startsWith('data:video/') ||
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.endsWith('.mov')
    );
  };

  return (
    <section id="video-kegiatan" className="py-14 sm:py-20 bg-slate-900 text-white border-t border-slate-800 relative overflow-hidden">
      
      {/* Hidden file input for direct video replacement on card */}
      <input
        ref={directVideoInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/*"
        onChange={handleDirectFileSelected}
        className="hidden"
      />

      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4 text-emerald-100 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold tracking-wide">
              <Film className="w-4 h-4 text-emerald-400" />
              <span>DOKUMENTASI & VIDEO KEGIATAN SANTRI</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight font-serif">
              Video Kegiatan Santri & Multimedia
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Koleksi video kegiatan harian dan kejuaraan santri SMK Islam Tanfirul Ghoyyi. Anda dapat <strong>mengganti video</strong>, <strong>mengunggah berkas MP4 langsung dari HP/Laptop</strong>, atau <strong>menempelkan link YouTube</strong>.
            </p>
          </div>

          {/* Action Buttons: Add Manual & Reset */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleAddNewVideo}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>+ Masukkan Video Baru</span>
            </button>

            <button
              onClick={handleResetDefault}
              title="Kembalikan ke video bawaan"
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Default</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-md'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-xs text-slate-400 ml-auto font-mono">
            {filteredVideos.length} Video Tersedia
          </span>
        </div>

        {/* Video Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-slate-800/90 rounded-2xl border border-slate-700/80 overflow-hidden shadow-lg hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col group relative"
            >
              {/* Thumbnail with Play Button Overlay */}
              <div 
                className="relative h-48 sm:h-52 bg-slate-950 overflow-hidden cursor-pointer"
                onClick={() => setActivePlayingVideo(video)}
              >
                <img
                  src={video.thumbnailUrl || '/video_lalaran_alfiyah.jpg'}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-13 h-13 rounded-full bg-emerald-600/90 group-hover:bg-amber-400 text-white group-hover:text-slate-950 flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-slate-950/90 text-white font-mono text-[11px] flex items-center gap-1 border border-slate-700">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{video.duration || 'Video'}</span>
                </div>

                {/* Category Pill */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-emerald-900/90 backdrop-blur-xs border border-emerald-600/60 text-emerald-200 text-[11px] font-bold shadow-xs">
                  {video.category}
                </div>

                {/* Direct Card Action Buttons (Always clearly accessible) */}
                <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5">
                  <button
                    onClick={(e) => triggerDirectUpload(video.id, e)}
                    title="Ganti Berkas Video langsung dari Galeri HP/Laptop"
                    className="px-2.5 py-1 bg-emerald-700/90 hover:bg-emerald-600 text-white rounded-md shadow-md backdrop-blur-xs flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-transform hover:scale-105"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Ganti Video</span>
                  </button>

                  <button
                    onClick={(e) => handleEditVideo(video, e)}
                    title="Edit Judul, Link, atau Keterangan Video"
                    className="px-2 py-1 bg-slate-900/90 hover:bg-slate-950 text-amber-300 rounded-md shadow-md backdrop-blur-xs flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-transform hover:scale-105"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* Delete button top right */}
                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={(e) => handleDeleteVideo(video.id, e)}
                    title="Hapus Video ini"
                    className="p-1.5 bg-slate-900/80 hover:bg-rose-900/90 text-slate-300 hover:text-rose-200 rounded-md border border-slate-700/60 transition-transform hover:scale-110 cursor-pointer shadow-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Content Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 
                    onClick={() => setActivePlayingVideo(video)}
                    className="font-bold text-white text-sm sm:text-base leading-snug group-hover:text-amber-300 transition-colors cursor-pointer line-clamp-2"
                  >
                    {video.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <div className="truncate max-w-[170px] text-[11px] font-medium text-emerald-400">
                    {video.speakerOrLead || 'Santri Tanfirul Ghoyyi'}
                  </div>

                  <button
                    onClick={() => setActivePlayingVideo(video)}
                    className="text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Putar Video</span>
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className="mt-8 text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-700 p-6">
            <Film className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">Belum Ada Video untuk Kategori Ini</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Anda dapat menambahkan video baru secara manual dengan mengeklik tombol di bawah.
            </p>
            <button
              onClick={handleAddNewVideo}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Masukkan Video Sekarang</span>
            </button>
          </div>
        )}

      </div>

      {/* MODAL 1: Full Cinema Video Player */}
      {activePlayingVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-md"
          onClick={() => setActivePlayingVideo(null)}
        >
          <div 
            className="max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Player Header */}
            <div className="p-3.5 sm:p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                <span className="font-bold text-xs sm:text-sm text-white truncate font-serif">
                  {activePlayingVideo.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    const it = activePlayingVideo;
                    setActivePlayingVideo(null);
                    handleEditVideo(it);
                  }}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit Video</span>
                </button>

                <button
                  onClick={() => setActivePlayingVideo(null)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Viewport */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {isDirectVideoUrl(activePlayingVideo.videoUrl) ? (
                <video
                  controls
                  autoPlay
                  playsInline
                  src={activePlayingVideo.videoUrl}
                  poster={activePlayingVideo.thumbnailUrl}
                  className="w-full h-full object-contain"
                >
                  Browser Anda tidak mendukung pemutaran video langsung.
                </video>
              ) : getYouTubeEmbedUrl(activePlayingVideo.videoUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(activePlayingVideo.videoUrl)!}
                  title={activePlayingVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-amber-400">
                    <VideoIcon className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">Video Siap Diputar atau Diganti</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Link video saat ini: <code className="text-emerald-400 break-all">{activePlayingVideo.videoUrl || 'Belum diisi berkas/link video'}</code>
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        const it = activePlayingVideo;
                        setActivePlayingVideo(null);
                        handleEditVideo(it);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Unggah Video dari HP/Komputer atau Link YouTube</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Video Meta Information */}
            <div className="p-4 sm:p-5 bg-slate-900 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                    {activePlayingVideo.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {activePlayingVideo.duration}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    {activePlayingVideo.dateAdded}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-medium">
                  Pelaksana: <span className="text-emerald-300 font-bold">{activePlayingVideo.speakerOrLead}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activePlayingVideo.description}
              </p>

              {/* Tags */}
              {activePlayingVideo.tags && activePlayingVideo.tags.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-1.5">
                  <Tag className="w-3 h-3 text-slate-500" />
                  {activePlayingVideo.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: Form Masukkan Video Baru & Edit Video Manual */}
      {editingVideo && formData && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto"
          onClick={() => {
            if (!saveLoading) setEditingVideo(null);
          }}
        >
          <div 
            className="max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl my-8 text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Title */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <VideoIcon className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm sm:text-base text-white font-serif">
                  {isNewVideo ? 'Masukkan Video Kegiatan Baru Secara Manual' : 'Edit Data & Sumber Video Kegiatan'}
                </h3>
              </div>
              <button
                type="button"
                disabled={saveLoading}
                onClick={() => setEditingVideo(null)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 text-xs cursor-pointer"
              >
                ✕ Batal
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
              
              {/* Judul Video */}
              <div>
                <label className="block font-bold text-slate-200 mb-1">
                  Judul Video Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Lalaran Nadhom Alfiyah Ibnu Malik Santri SMK TANGO"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-hidden focus:border-emerald-500 font-medium text-xs sm:text-sm"
                />
              </div>

              {/* Kategori & Durasi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Kategori Kegiatan
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-hidden focus:border-emerald-500 font-medium"
                  >
                    <option value="Lalaran Alfiyah">Lalaran Alfiyah Ibnu Malik</option>
                    <option value="Praktek DKV">Praktek Studio DKV & Multimedia</option>
                    <option value="Tahfidz Al-Qur'an">Tahfidz & Tartil Al-Qur'an</option>
                    <option value="English Class">English Class & Public Speaking</option>
                    <option value="Ekstrakurikuler">Ekstrakurikuler & Lomba</option>
                    <option value="Umum">Kegiatan Umum Pesantren</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Durasi Video (Menit:Detik)
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Contoh: 04:15"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Sumber Video: File Langsung ATAU YouTube Link */}
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-amber-400" />
                    <span>Sumber Berkas Video</span>
                  </span>
                  {isProcessingFile && (
                    <span className="text-[11px] text-amber-300 flex items-center gap-1 font-semibold">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Memproses video...</span>
                    </span>
                  )}
                </div>

                {/* Option 1: File Upload */}
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300 text-[11px]">
                      Pilihan 1: Unggah Berkas Video Langsung (.mp4 / .webm / .mov)
                    </span>
                    <button
                      type="button"
                      onClick={() => modalVideoInputRef.current?.click()}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Pilih Video dari HP/Komputer</span>
                    </button>
                    <input
                      ref={modalVideoInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/*"
                      onChange={handleModalVideoFileChange}
                      className="hidden"
                    />
                  </div>

                  {pendingVideoFile && (
                    <div className="text-emerald-400 text-[11px] font-mono bg-emerald-950/60 p-2 rounded border border-emerald-800/40 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      <span>Berkas terpilih: <strong>{pendingVideoFile.name}</strong> ({(pendingVideoFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    </div>
                  )}
                </div>

                {/* Option 2: YouTube / Online Link */}
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <label className="block text-slate-300 font-bold text-[11px]">
                    Pilihan 2: Tempel Link YouTube / Shorts / Embed
                  </label>
                  <input
                    type="text"
                    value={formData.videoUrl.startsWith('blob:') || formData.videoUrl.startsWith('data:') ? '' : formData.videoUrl}
                    onChange={(e) => {
                      setPendingVideoFile(null);
                      setFormData({ ...formData, videoUrl: e.target.value });
                    }}
                    placeholder="Contoh: https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-emerald-300 focus:outline-hidden focus:border-emerald-500 font-mono text-xs"
                  />
                </div>

                {/* Live Video Preview Box in Modal */}
                {formData.videoUrl && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">
                      Pratinjau Video Terpilih:
                    </span>
                    <div className="h-36 bg-black rounded-lg overflow-hidden border border-slate-700 flex items-center justify-center">
                      {isDirectVideoUrl(formData.videoUrl) ? (
                        <video
                          controls
                          playsInline
                          src={formData.videoUrl}
                          className="w-full h-full object-contain"
                        />
                      ) : getYouTubeEmbedUrl(formData.videoUrl) ? (
                        <iframe
                          src={getYouTubeEmbedUrl(formData.videoUrl)!}
                          title="Preview"
                          className="w-full h-full border-0"
                        />
                      ) : (
                        <div className="text-slate-500 text-xs font-mono">
                          Link tersimpan: {formData.videoUrl}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Foto Video */}
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
                <label className="block font-bold text-slate-200">
                  Foto Sampul (Thumbnail) Video
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-32 h-20 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shrink-0 relative">
                    <img
                      src={formData.thumbnailUrl || '/video_lalaran_alfiyah.jpg'}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <p className="text-[11px] text-slate-400">
                      Thumbnail dapat diambil otomatis saat Anda mengunggah video, atau Anda bisa memilih foto kustom dari galeri.
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <button
                        type="button"
                        onClick={() => modalThumbInputRef.current?.click()}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-amber-400" />
                        <span>Pilih Foto Sampul Kustom</span>
                      </button>
                      <input
                        ref={modalThumbInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleModalThumbFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pelaksana / Pembina & Tanggal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Pelaksana / Narasumber / Asatidz
                  </label>
                  <input
                    type="text"
                    value={formData.speakerOrLead || ''}
                    onChange={(e) => setFormData({ ...formData, speakerOrLead: e.target.value })}
                    placeholder="Contoh: Santri & Dewan Asatidz PP. Tanfirul Ghoyyi"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-hidden focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Tanggal Dokumentasi
                  </label>
                  <input
                    type="date"
                    value={formData.dateAdded}
                    onChange={(e) => setFormData({ ...formData, dateAdded: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Deskripsi Video */}
              <div>
                <label className="block font-bold text-slate-200 mb-1">
                  Deskripsi Penjelasan Video
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tuliskan keterangan suasana, latar belakang kegiatan, materi pembelajaran, atau pesan inspiratif dari video ini..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-hidden focus:border-emerald-500 font-medium"
                />
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={saveLoading}
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saveLoading || isProcessingFile}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saveLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Simpan Video</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </section>
  );
};

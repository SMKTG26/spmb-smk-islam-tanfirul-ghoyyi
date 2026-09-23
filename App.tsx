import { OfficialHeaderBanner } from './OfficialHeaderBanner';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { PrincipalWelcomeSection } from './PrincipalWelcomeSection';
import { MuassisSection } from './MuassisSection';
import { MajorsSection } from './MajorsSection';
import { StudentAchievementsSection } from './StudentAchievementsSection';
import { SchoolActivities } from './SchoolActivities';
import { ActivityVideosSection } from './ActivityVideosSection';
import { RegistrationFlowAndFees } from './RegistrationFlowAndFees';
import { RegistrationWizard } from './RegistrationWizard';
import { StatusCheckAndCard } from './StatusCheckAndCard';
import { AdminPanel } from './AdminPanel';
import { FaqAndContact } from './FaqAndContact';
import { Footer } from './Footer';
export default function App() {
  const [activeTab, setActiveTab] = useState<'beranda' | 'muassis' | 'kepala-sekolah' | 'jurusan' | 'prestasi' | 'kegiatan' | 'video' | 'alur' | 'daftar' | 'status' | 'admin'>('beranda');
  const [selectedMajorForRegister, setSelectedMajorForRegister] = useState<MajorCode>('DKV');
  const [targetStudentForCard, setTargetStudentForCard] = useState<StudentRegistration | null>(null);

  const handleSelectMajorToRegister = (major: MajorCode) => {
    setSelectedMajorForRegister(major);
    setActiveTab('daftar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegistrationSuccess = (student: StudentRegistration) => {
    setTargetStudentForCard(student);
    setActiveTab('status');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewStudentCardFromAdmin = (student: StudentRegistration) => {
    setTargetStudentForCard(student);
    setActiveTab('status');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      
      {/* Official Institutional KOP Banner matching KOP LEMBAGA.jpeg */}
      <OfficialHeaderBanner />

      {/* Main Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'beranda' && (
          <>
            <Hero
              onRegisterClick={() => {
                setActiveTab('daftar');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onCheckStatusClick={() => {
                setActiveTab('status');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreMajorsClick={() => {
                const el = document.getElementById('jurusan-preview');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreActivitiesClick={() => {
                const el = document.getElementById('kegiatan');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Foto Muassis & Pendiri Lembaga Yang Bisa Diedit & Diupload */}
            <div id="muassis">
              <MuassisSection onRegisterClick={() => setActiveTab('daftar')} />
            </div>

            {/* Foto Kepala Sekolah Yang Besar & Sambutan SPMB (Bisa Diunggah Manual) */}
            <div id="kepala-sekolah">
              <PrincipalWelcomeSection onRegisterClick={() => setActiveTab('daftar')} />
            </div>

            {/* DKV Single Major Spotlight */}
            <div id="jurusan-preview">
              <MajorsSection onSelectMajor={handleSelectMajorToRegister} />
            </div>

            {/* Student Achievements Showcase (Nasional, Provinsi, Kabupaten) */}
            <div id="prestasi">
              <StudentAchievementsSection onRegisterClick={() => setActiveTab('daftar')} />
            </div>

            {/* Program Kegiatan Santri: Harian, Bulanan, Tahunan */}
            <div id="kegiatan">
              <SchoolActivities />
            </div>

            {/* Video Kegiatan Santri & Multimedia (Bisa Diedit & Diinput Manual) */}
            <div id="video">
              <ActivityVideosSection />
            </div>

            {/* Waktu Pendaftaran, Cara Daftar & Barcode Resmi */}
            <RegistrationFlowAndFees
              onStartRegistration={() => {
                setActiveTab('daftar');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* FAQ & Contact Hotline */}
            <FaqAndContact />
          </>
        )}

        {activeTab === 'muassis' && (
          <div className="pt-2">
            <MuassisSection onRegisterClick={() => setActiveTab('daftar')} />
            <FaqAndContact />
          </div>
        )}

        {activeTab === 'kepala-sekolah' && (
          <div className="pt-2">
            <PrincipalWelcomeSection onRegisterClick={() => setActiveTab('daftar')} />
            <FaqAndContact />
          </div>
        )}

        {activeTab === 'jurusan' && (
          <div className="pt-4">
            <MajorsSection onSelectMajor={handleSelectMajorToRegister} />
            <FaqAndContact />
          </div>
        )}

        {activeTab === 'prestasi' && (
          <div className="pt-4">
            <StudentAchievementsSection onRegisterClick={() => setActiveTab('daftar')} />
            <FaqAndContact />
          </div>
        )}

        {activeTab === 'kegiatan' && (
          <div className="pt-4 space-y-6">
            <SchoolActivities />
            <ActivityVideosSection />
            <FaqAndContact />
          </div>
        )}

        {activeTab === 'video' && (
          <div className="pt-4">
            <ActivityVideosSection />
            <FaqAndContact />
          </div>
        )}

        {activeTab === 'alur' && (
          <div className="pt-4">
            <RegistrationFlowAndFees
              onStartRegistration={() => {
                setActiveTab('daftar');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <FaqAndContact />
          </div>
        )}

        {activeTab === 'daftar' && (
          <RegistrationWizard
            initialMajor={selectedMajorForRegister}
            onRegistrationSuccess={handleRegistrationSuccess}
            onCancel={() => {
              setActiveTab('beranda');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'status' && (
          <StatusCheckAndCard
            initialStudent={targetStudentForCard}
            onNavigateToRegister={() => {
              setActiveTab('daftar');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel onViewStudentCard={handleViewStudentCardFromAdmin} />
        )}
      </main>

      {/* Institutional Footer */}
      <Footer onNavigate={(tab) => {
        setActiveTab(tab as any);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

    </div>
  );
}

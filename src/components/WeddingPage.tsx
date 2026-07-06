import Hero from '@/components/Hero';
import QuickMenu from '@/components/QuickMenu';
import Invitation from '@/components/Invitation';
import CalendarSchedule from '@/components/CalendarSchedule';
import Location from '@/components/Location';
import AboutUs from '@/components/AboutUs';
import OurStory from '@/components/OurStory';
import Gallery from '@/components/Gallery';
import PohangGuide from '@/components/PohangGuide';
import Account from '@/components/Account';
import Closing from '@/components/Closing';
import MusicToggle from '@/components/MusicToggle';
import ScrollReveal from '@/components/ScrollReveal';
import EnvelopeIntro from '@/components/EnvelopeIntro';
import SideTimeline from '@/components/SideTimeline';

type WeddingPageProps = {
  showAccount: boolean;
};

export default function WeddingPage({ showAccount }: WeddingPageProps) {
  return (
    <main className="mobile-shell">
      <EnvelopeIntro />
      <ScrollReveal />
      <SideTimeline showAccount={showAccount} />
      <MusicToggle />
      <Hero />
      <Invitation />
      <CalendarSchedule />
      <QuickMenu showAccount={showAccount} />
      <Location />
      <AboutUs />
      <OurStory />
      <Gallery />
      <PohangGuide />
      {showAccount && <Account />}
      <Closing />
    </main>
  );
}

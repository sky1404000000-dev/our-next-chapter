import EnvelopeIntro from './components/EnvelopeIntro';
import MusicToggle from './components/MusicToggle';
import ScrollReveal from './components/ScrollReveal';
import SideTimeline from './components/SideTimeline';
import Account from './sections/account/Account';
import Closing from './sections/closing/Closing';
import Gallery from './sections/gallery/Gallery';
import PohangGuide from './sections/guide/PohangGuide';
import Invitation from './sections/invitation/Invitation';
import Location from './sections/location/Location';
import AboutUs from './sections/people/AboutUs';
import CalendarSchedule from './sections/schedule/CalendarSchedule';
import OurStory from './sections/story/OurStory';

type WeddingPageProps = {
  showAccount: boolean;
};

export default function WeddingPage({ showAccount }: WeddingPageProps) {
  return (
    <main className="mobile-shell">
      <ScrollReveal />
      <SideTimeline showAccount={showAccount} />
      <MusicToggle />
      <EnvelopeIntro />
      <Invitation />
      <CalendarSchedule />
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

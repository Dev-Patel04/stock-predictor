import './App.css';
import SpaceBackground from './components/SpaceBackground';
import Tabs from './components/Tabs';
import Predictor from './components/Predictor';
import History from './components/History';
import News from './components/News';
import Settings from './components/Settings';

function App() {
  return (
    <>
      <SpaceBackground />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Tabs>
          {[<Predictor key="predictor" />, <History key="history" />, <News key="news" />, <Settings key="settings" />]}
        </Tabs>
      </div>
    </>
  );
}

export default App;

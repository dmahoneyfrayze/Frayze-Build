import { ThemeProvider } from '@/components/theme-provider';
import FrayzeStackBuilder from '@/components/frayze-stack-builder';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="w-full min-h-screen flex flex-col items-center">
        <div className="w-full max-w-4xl p-4">
          <FrayzeStackBuilder />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
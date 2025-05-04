import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PostHogProvider} from 'posthog-js/react'

const options = {
  api_host: "https://us.i.posthog.com",
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/**@ts-ignore */}
     <PostHogProvider 
      apiKey={"phc_wXgrqQTjRA8gdQqoWBDGHj598ky4o1RGIPWlyiVCYwJ"}
      options={options}
    >
    <App />
    </PostHogProvider>
  </StrictMode>,
)

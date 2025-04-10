import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// Assuming these components/context exist and are configured:
// import { AuthContext } from '../AuthProvider';
import Navbar from '../components/Navbar'; // Assuming Navbar component exists
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Icons --- (Keep the icons from the previous version)
const ShareIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}> <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /> </svg> );
const CopyLinkIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}> <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /> </svg> );
const EditIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}> <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /> </svg> );
const CloseIcon = ({ className = "h-6 w-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> </svg> );
const WhatsAppIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"> <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/> </svg> );
const DownloadIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}> <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /> </svg> );


// --- Configuration ---
const APP_NAME = "Tutors Forum";
// **** UPDATE LINKS ****
const WEBSITE_LINK = "https://TutorsForum.in"; // Assuming HTTPS
const APP_LINK = "https://play.google.com/store/apps/details?id=in.sci.tutorsforum";
const INSTITUTE_LOGO_URL = "tficon.png"; // Placeholder Logo URL
const INSTITUTE_CONTACT = "+91-9876543210"; // <-- UPDATE CONTACT

// --- Mock Data with Internet Image URLs & Adjusted Layouts ---
const mockPosters = [
  // (Same mock data array as the previous response, using picsum URLs)
  { id: 'festive1', category: 'Festive', imageUrl: 'https://picsum.photos/seed/diwali/600/600', baseMessage: 'Happy Diwali! ✨ Light up your learning journey with TutorsForum.', tags: ['festival', 'wishes', 'diwali', 'deepavali'], brandingLayout: { logo: { x: 30,  y: 490, maxWidth: 100 }, name: { x: 140, y: 515, font: 'bold 22px Arial', color: '#FFFFFF', align: 'left' }, contact: { x: 140, y: 545, font: '18px Arial', color: '#FFFFFF', align: 'left' } } },
  { id: 'festive2', category: 'Festive', imageUrl: 'https://picsum.photos/seed/holi/600/600', baseMessage: 'Happy Holi! 🎨 Add color to your success with TutorsForum.', tags: ['festival', 'wishes', 'holi'], brandingLayout: { logo: { x: 30,  y: 490, maxWidth: 100 }, name: { x: 140, y: 515, font: 'bold 22px "Comic Sans MS"', color: '#FFFF00', align: 'left' }, contact: { x: 140, y: 545, font: '18px "Comic Sans MS"', color: '#FFFF00', align: 'left' } } },
  { id: 'course1', category: 'Course Promotion', imageUrl: 'https://picsum.photos/seed/mathpromo/600/600', baseMessage: 'Master Calculus! 📈 Join our advanced mathematics course on TutorsForum.', tags: ['course', 'math', 'calculus', 'advanced'], brandingLayout: { logo: { x: 30,  y: 490, maxWidth: 100 }, name: { x: 140, y: 515, font: 'bold 22px Verdana', color: '#FFFFFF', align: 'left' }, contact: { x: 140, y: 545, font: '18px Verdana', color: '#FFFFFF', align: 'left' } } },
  { id: 'course2', category: 'Course Promotion', imageUrl: 'https://picsum.photos/seed/sciencepromo/600/600', baseMessage: 'Ace your Science exams! 🔬 Comprehensive course available on TutorsForum.', tags: ['course', 'science', 'exams'], brandingLayout: { logo: { x: 30,  y: 490, maxWidth: 100 }, name: { x: 140, y: 515, font: 'bold 22px Tahoma', color: '#FFFFFF', align: 'left' }, contact: { x: 140, y: 545, font: '18px Tahoma', color: '#FFFFFF', align: 'left' } } },
  { id: 'general1', category: 'General', imageUrl: 'https://picsum.photos/seed/learningquote/600/600', baseMessage: 'The beautiful thing about learning is that no one can take it away from you. Keep growing with TutorsForum.', tags: ['motivation', 'quote', 'learning', 'general'], brandingLayout: { logo: { x: 30,  y: 490, maxWidth: 100 }, name: { x: 140, y: 515, font: 'bold 22px Georgia', color: '#FFFFFF', align: 'left' }, contact: { x: 140, y: 545, font: '18px Georgia', color: '#FFFFFF', align: 'left' } } },
];


// --- Helper Function: Convert Data URL to File ---
async function dataURLtoFile(dataurl, filename) {
  if (!dataurl || !dataurl.startsWith('data:image/')) {
    console.error("Invalid data URL provided:", dataurl);
    return null;
  }
  try {
    // Use fetch API to get blob from data URL
    const res = await fetch(dataurl);
    const blob = await res.blob();
    // Create File object
    const file = new File([blob], filename, { type: blob.type || 'image/png' }); // Use blob type or default to png
    return file;
  } catch (error) {
      console.error("Error converting data URL to File:", error);
      return null;
  }
}


// --- Component ---
function SharePoster() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // State variables
  const [posters, setPosters] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null); // Data URL
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial poster list (simulated)
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setPosters(mockPosters);
      const uniqueCategories = ['All', ...new Set(mockPosters.map(p => p.category))];
      setCategories(uniqueCategories);
      setIsLoading(false);
    }, 500);
  }, []);

  // --- Filtering Logic ---
  const filteredPosters = posters.filter(poster => {
    const categoryMatch = activeCategory === 'All' || poster.category === activeCategory;
    const searchMatch = searchTerm === '' ||
                        poster.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (poster.tags && poster.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    return categoryMatch && searchMatch;
  });


  // --- Image Generation & Handling --- (no console logs needed now)
  const generateImageWithBranding = (poster) => {
     if (!poster || !poster.brandingLayout) { toast.error("Poster layout data is missing."); return; }
     setIsGenerating(true);
     setGeneratedImageUrl(null);
     const canvas = canvasRef.current || document.createElement('canvas');
     canvasRef.current = canvas;
     const ctx = canvas.getContext('2d');
     const baseImg = new Image();
     const logoImg = new Image();
     baseImg.crossOrigin = "anonymous";
     logoImg.crossOrigin = "anonymous";
     let imagesLoadedCount = 0;
     let errorsOccurred = false;
     const totalImages = 2;

     const finalizeGeneration = () => {
         if (errorsOccurred) { setIsGenerating(false); setGeneratedImageUrl(null); return; }
         try {
             canvas.width = baseImg.naturalWidth; canvas.height = baseImg.naturalHeight;
             ctx.clearRect(0, 0, canvas.width, canvas.height);
             ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
             // Draw Logo
             const logoLayout = poster.brandingLayout.logo;
             let logoW = logoImg.naturalWidth; let logoH = logoImg.naturalHeight;
             if (logoLayout.maxWidth && logoW > logoLayout.maxWidth) { const ratio = logoLayout.maxWidth / logoW; logoW = logoLayout.maxWidth; logoH = logoH * ratio; }
             if (logoLayout.x !== undefined && logoLayout.y !== undefined && logoW > 0 && logoH > 0) { ctx.drawImage(logoImg, logoLayout.x, logoLayout.y, logoW, logoH); }
             // Draw Text
             const drawText = (layout, text) => { if (!layout || !text) return; ctx.font = layout.font || '16px Arial'; ctx.fillStyle = layout.color || '#FFFFFF'; ctx.textAlign = layout.align || 'left'; ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; ctx.shadowBlur = 3; ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 1; ctx.fillText(text, layout.x, layout.y); ctx.shadowColor = 'transparent'; }
             drawText(poster.brandingLayout.name, APP_NAME);
             drawText(poster.brandingLayout.contact, INSTITUTE_CONTACT);
             // Export
             try { const dataUrl = canvas.toDataURL('image/png'); setGeneratedImageUrl(dataUrl); }
             catch (e) { console.error("Canvas export error:", e); toast.error("Cannot generate preview (CORS?)."); setGeneratedImageUrl(null); errorsOccurred = true;}
         } catch (error) { console.error("Canvas drawing error:", error); toast.error("Failed to draw preview."); setGeneratedImageUrl(null); errorsOccurred = true; }
         finally { setIsGenerating(false); }
     };
     const onImageLoad = () => { imagesLoadedCount++; if (imagesLoadedCount === totalImages) { finalizeGeneration(); } };
     const onImageError = (e, imgType, url) => { console.error(`ERROR loading ${imgType}: ${url}`, e); let errorMsg = `Failed to load ${imgType}.`; if (e && e.type === 'error' && !url.startsWith('data:')) { errorMsg += ' Check URL & CORS.'; } toast.error(errorMsg); errorsOccurred = true; imagesLoadedCount++; if (imagesLoadedCount === totalImages) { finalizeGeneration(); } };
     baseImg.onload = () => onImageLoad('Base Image'); logoImg.onload = () => onImageLoad('Logo Image');
     baseImg.onerror = (e) => onImageError(e, 'Base Image', poster.imageUrl); logoImg.onerror = (e) => onImageError(e, 'Logo Image', INSTITUTE_LOGO_URL);
     baseImg.src = poster.imageUrl; logoImg.src = INSTITUTE_LOGO_URL;
  };

  // --- Other Handlers ---
  const handlePosterSelect = (poster) => { setSelectedPoster(poster); setGeneratedImageUrl(null); generateImageWithBranding(poster); };
  const handleClosePreview = () => { setSelectedPoster(null); setGeneratedImageUrl(null); };
  const handleCopyLink = () => { if (!selectedPoster) return; const messageToCopy = generateShareMessage(selectedPoster); navigator.clipboard.writeText(messageToCopy) .then(() => toast.success('Message & Link copied to clipboard!')) .catch(() => toast.error('Failed to copy.')); };

  // Updated to use new APP_LINK
  const generateShareMessage = (poster) => {
    const baseMsg = poster?.baseMessage || `Check out ${APP_NAME}!`;
    // Using the new APP_LINK constant
    const defaultCTA = `Get access to study material, live classes, mock tests, guidance and more on ${APP_NAME}.\nDownload Now: ${APP_LINK}`;
    // Optionally add website link too: const websiteInfo = `\nVisit us: ${WEBSITE_LINK}`;
    return `${baseMsg}\n\n${defaultCTA}`; // Decide if you want to include websiteInfo
  };

  // Updated handleShare to include the generated image file
  const handleShare = async () => {
      if (!selectedPoster || isGenerating) return;

      const text = generateShareMessage(selectedPoster);
      const shareTitle = `Check out this poster from ${APP_NAME}`;
      let imageFile = null;

      // Try to prepare the image file ONLY if generation was successful
      if (generatedImageUrl) {
          const filename = `${APP_NAME.toLowerCase().replace(/\s+/g, '-')}-poster-${selectedPoster.id}.png`;
          imageFile = await dataURLtoFile(generatedImageUrl, filename);
      }

      // Check if Web Share API is available AND if we can share files
      if (navigator.share && imageFile && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
          // Attempt to share image file + text + URL
          try {
              const shareData = {
                  title: shareTitle,
                  text: text,
                  url: APP_LINK, // Still useful as fallback link
                  files: [imageFile]
              };
              await navigator.share(shareData);
              toast.info('Sharing poster...');
          } catch (err) {
              if (err.name !== 'AbortError') {
                  console.error("File sharing failed:", err);
                  toast.error(`Sharing failed: ${err.message}`);
                  // Optional: Fallback to sharing text only if file share fails?
              }
          }
      } else if (navigator.share) {
           // Fallback: If file sharing isn't supported or image failed, share text/URL only
            try {
                const fallbackShareData = {
                    title: shareTitle,
                    text: text,
                    url: APP_LINK,
                };
                await navigator.share(fallbackShareData);
                toast.info('Sharing link and text...');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    toast.error(`Sharing failed: ${err.message}`);
                }
            }
      }
      else {
          // If Web Share API itself isn't supported
          toast.info('Web Share not supported. Use WhatsApp or Copy Text.');
      }
  };

  // WhatsApp only shares text message + link
  const handleShareViaWhatsApp = () => { if (!selectedPoster) return; const message = generateShareMessage(selectedPoster); const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`; window.open(whatsappUrl, '_blank', 'noopener,noreferrer'); };

  // Copy only copies text message + link
  const handleCopyText = () => { if (!selectedPoster) return; const messageToCopy = generateShareMessage(selectedPoster); navigator.clipboard.writeText(messageToCopy) .then(() => toast.success('Message & Link copied!')) .catch(() => toast.error('Failed to copy.')); };

  // Download handler remains the same
  const handleDownload = () => { if (!generatedImageUrl || !selectedPoster) return; const link = document.createElement('a'); link.href = generatedImageUrl; const filename = `${APP_NAME.toLowerCase().replace(/\s+/g, '-')}-poster-${selectedPoster.id}.png`; link.download = filename; document.body.appendChild(link); link.click(); document.body.removeChild(link); toast.success("Poster downloaded!"); };


  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-100">
    <div className="pt-16 pb-12 px-4 md:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Promotional Posters</h1>
        <p className="text-sm text-gray-500 mt-1">Select a poster to share or download.</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center">
         <div className="flex flex-wrap gap-2 justify-center md:justify-start">
             {categories.map(category => ( <button key={category} onClick={() => setActiveCategory(category)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-150 ${ activeCategory === category ? 'bg-indigo-500 border-indigo-500 text-white shadow-sm' : 'bg-white border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600' }`} > {category} </button> ))}
         </div>
         <div className="w-full md:w-auto md:ml-auto"> <input type="text" placeholder="Search posters..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm"/> </div>
      </div>

      {/* Poster Grid */}
      {isLoading ? ( <div className="text-center py-10 text-gray-500">Loading posters...</div> )
       : filteredPosters.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredPosters.map(poster => (
            <div key={poster.id} onClick={() => handlePosterSelect(poster)} className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden cursor-pointer transition-all duration-200 group relative aspect-[1/1]">
              <img src={poster.imageUrl} alt={`${poster.category} Poster`} className="w-full h-full object-cover group-hover:opacity-90 bg-gray-200" loading="lazy" />
               <span className="absolute top-2 left-2 bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded">{poster.category}</span>
            </div>
          ))}
        </div>
      ) : ( <div className="text-center py-10 text-gray-500">No posters found matching your criteria.</div> )}

      {/* Poster Preview Modal */}
      {selectedPoster && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={handleClosePreview}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto overflow-hidden transform transition-all duration-300 scale-100" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center p-3 border-b border-gray-200"> <h3 className="text-lg font-semibold text-gray-700">Poster Preview & Share</h3> <button onClick={handleClosePreview} className="text-gray-400 hover:text-gray-600"> <CloseIcon /> </button> </div>
             <div className="p-4 max-h-[75vh] overflow-y-auto text-center">
               {/* Display Area for Generated Image */}
               <div className="mb-4 min-h-[200px] flex items-center justify-center bg-gray-100 rounded-md border border-gray-200">
                   {isGenerating && (<p className="text-gray-500 animate-pulse px-4">Generating preview...</p>)}
                   {!isGenerating && generatedImageUrl && (<img src={generatedImageUrl} alt="Generated Poster Preview" className="max-w-full max-h-[50vh] h-auto rounded-md shadow"/>)}
                   {!isGenerating && !generatedImageUrl && (<p className="text-red-600 font-medium px-4">Preview generation failed.<br/><span className="text-sm text-gray-500 font-normal">Check console & image source CORS headers.</span></p>)}
               </div>
               {/* Action Buttons */}
               <div className="space-y-3 mt-4">
                   {/* Row 1: Edit (Disabled), Download */}
                   <div className="flex flex-col sm:flex-row gap-3">
                        {/* **** EDIT BUTTON DISABLED **** */}
                        <button
                            disabled // Disable the button
                            title="Edit Poster (Feature coming soon)"
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-400 px-4 py-2 rounded-md transition-colors text-sm font-medium border border-gray-300 cursor-not-allowed" // Disabled styling
                        >
                            <EditIcon className="h-4 w-4" /> Edit
                        </button>
                        <button onClick={handleDownload} disabled={!generatedImageUrl || isGenerating} title="Download this poster" className={`flex-1 inline-flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${(!generatedImageUrl || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''}`}> <DownloadIcon className="h-4 w-4" /> Download </button>
                   </div>
                    {/* Row 2: Share, WhatsApp, Copy */}
                   <div className="flex flex-col sm:flex-row gap-3">
                        <button onClick={handleShare} disabled={!navigator.share} title={navigator.share ? "Share via system dialog" : "Web Share not supported"} className={`flex-1 inline-flex items-center justify-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors text-sm font-medium shadow-sm ${!navigator.share ? 'opacity-50 cursor-not-allowed' : ''}`}> <ShareIcon className="h-4 w-4" /> Share </button>
                        <button onClick={handleShareViaWhatsApp} title="Share via WhatsApp" className="flex-1 inline-flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-medium shadow-sm"> <WhatsAppIcon className="h-4 w-4"/> WhatsApp </button>
                        <button onClick={handleCopyLink} title="Copy message and link" className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm font-medium"> <CopyLinkIcon className="h-4 w-4" /> Copy Text </button>
                   </div>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  </div>

  );
}

// --- Dummy Navbar (Replace with yours) ---
// const Navbar = () => ( <nav className="fixed top-0 left-0 right-0 bg-white shadow-md h-14 z-40 flex items-center px-4"> <span className="text-xl font-bold text-indigo-600">{APP_NAME}</span> </nav> );

export default SharePoster;
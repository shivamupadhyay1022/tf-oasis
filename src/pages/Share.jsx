import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar"; // Assuming Navbar component exists
import { useAuth } from "../components/AuthContext";// Assuming AuthProvider exists
import { db } from "../firebase"; // Assuming firebase config exists
import { ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify"; // Assuming react-toastify is installed and configured
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

// --- SVG Icons (Placeholders - Replace with your actual icons) ---
// Using slightly more conventional names and consistent strokeWidth

const ExternalLinkIcon = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-4.5 0V6.375c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125V10.5m-7.5 0h7.5"
    />
  </svg>
);

const ShareIcon = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
    />
  </svg>
);

const WhatsAppIcon = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const CopyLinkIcon = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
    />
  </svg>
);

const PosterIcon = (
  { className = "h-10 w-10" } // Specific icon for poster card
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
    />
  </svg>
);

// Icons for Quick Actions (using size h-7 w-7 for slightly smaller look)
const QuickMarketIcon = ({ className = "h-7 w-7" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
    />
  </svg>
);

const PollIcon = ({ className = "h-7 w-7" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"
    />
  </svg>
);

const HelpFriendIcon = ({ className = "h-7 w-7" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L25.5 5.25l-.813 2.846a4.5 4.5 0 00-3.09 3.09L18.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09L11.25 18.75l.813-2.846a4.5 4.5 0 003.09-3.09L18.25 12z"
    />
  </svg> // Using Sparkles as placeholder
);

const NotificationIcon = ({ className = "h-7 w-7" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
    />
  </svg>
);

// --- Component ---

function Share() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sharedContent = searchParams.get("content") || ""; // Specific content to share
  const [message, setMessage] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [recipientType, setRecipientType] = useState("tutor"); // Default to 'tutor'
  const {currentUser} = useAuth()
  const [baseUrl, setBaseUrl] = useState("");
  const [contentShareLink, setContentShareLink] = useState(""); // Link for the specific content
  const [websiteUrl, setWebsiteUrl] = useState(""); // User's profile/website URL
  const [appShareLink, setAppShareLink] = useState(""); // General App/Website link for promotion

  useEffect(() => {
    const origin = window.location.origin;
    setBaseUrl(origin);

    if (sharedContent) {
      const encodedContent = encodeURIComponent(sharedContent);
      setContentShareLink(`${origin}/share?content=${encodedContent}`);
    } else {
      setContentShareLink("");
    }

    const profilePath = currentUser?.uid ? `/profile/${currentUser.uid}` : "/";
    setWebsiteUrl(`${origin}${profilePath}`);
    setAppShareLink(origin); // Adjust if app link is different
  }, [sharedContent, currentUser]);

  // --- Handlers ---

  const handleDirectShare = () => {
    if (!currentUser) {
      showToast("error", "You must be signed in to share content");
      navigate("/signin"); // Redirect to signin if not logged in
      return;
    }
    if (!selectedRecipient) {
      showToast("error", "Please enter a recipient ID");
      return;
    }
    if (!sharedContent) {
      showToast("error", "No specific content available to share directly.");
      return;
    }

    const notificationId = uuidv4();
    const validRecipientType = recipientType === "tutor" ? "tutors" : "users";
    const notificationPath = `${validRecipientType}/${selectedRecipient}/notifications/${notificationId}`;

    set(ref(db, notificationPath), {
      message: message || `Someone shared content with you!`,
      content: sharedContent,
      link: contentShareLink,
      timestamp: Date.now(),
      from: currentUser.uid,
      senderType: currentUser?.userType || "unknown", // Ensure you have userType in context
    })
      .then(() => {
        showToast("success", "Content shared successfully!");
        // Optionally clear fields after successful share
        // setMessage("");
        // setSelectedRecipient("");
      })
      .catch((error) => {
        showToast("error", `Error sharing content: ${error.message}`);
      });
  };

  const copyToClipboard = (linkToCopy, linkType = "Link") => {
    if (!linkToCopy) {
      showToast("error", `${linkType} not available to copy.`);
      return;
    }
    navigator.clipboard
      .writeText(linkToCopy)
      .then(() => showToast("success", `${linkType} copied to clipboard!`))
      .catch(() => showToast("error", "Failed to copy link."));
  };

  const shareViaWhatsApp = (linkToShare, defaultMessage) => {
    if (!linkToShare) {
      showToast("error", "Link not available to share.");
      return;
    }
    const text = encodeURIComponent(`${defaultMessage}: ${linkToShare}`);
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleStartSharingPostersPosters = () => {
    navigate("/create-poster"); // Ensure this route exists
  };

  const handleQuickAction = (path) => {
    if (path) {
      navigate(path); // Ensure these routes exist
    } else {
      showToast("info", "Feature coming soon!"); // Placeholder for actions without paths
    }
  };

  const showToast = (type, message) => {
    const options = {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light", // Or "dark" or "colored"
    };
    toast[type](message, options);
  };

  // --- Data for Quick Actions ---
  const quickActions = [
    {
      id: "market",
      label: "Market App",
      icon: <QuickMarketIcon />,
      path: "/marketing-tools",
    },
    {
      id: "poll",
      label: "Create Polls",
      icon: <PollIcon />,
      path: "/create-poll",
    },
    {
      id: "refer",
      label: "Help a Friend",
      icon: <HelpFriendIcon />,
      path: "/referral",
    },
    {
      id: "notify",
      label: "Send Alert",
      icon: <NotificationIcon />,
      path: "/send-notification",
    },
  ];

  // --- Render ---

  return (
    // Updated background to light gray, matching common functional themes
    <div className="min-h-screen bg-gray-100">
      {/* Adjusted padding top and bottom */}
      <div className="pt-20 pb-12 px-4 max-w-2xl mx-auto space-y-6">
        {/* --- 1. Website Promotion Card --- */}
        {/* Kept white background, updated button styles */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-1.5">
              Grow with your Website!
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Share your website link easily.
            </p>
            <div className="flex flex-wrap gap-3">
              {/* Secondary style button (light indigo) */}
              <button
                onClick={() =>
                  window.open(websiteUrl, "_blank", "noopener,noreferrer")
                }
                className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md hover:bg-indigo-200 transition-colors text-xs font-medium shadow-sm"
              >
                <ExternalLinkIcon className="h-4 w-4" /> Open Website
              </button>
              {/* Kept WhatsApp distinct green */}
              <button
                onClick={() =>
                  shareViaWhatsApp(websiteUrl, "Check out my website")
                }
                className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 transition-colors text-xs font-medium shadow-sm"
              >
                <WhatsAppIcon className="h-4 w-4" /> Share Website
              </button>
            </div>
          </div>
        </div>

        {/* --- 2. Quick Actions Section --- */}
        {/* Updated icon colors and focus rings */}
        <div>
          <h2 className="text-base font-semibold text-gray-600 mb-2 px-1">
            Quick Actions
          </h2>
          <div className="grid grid-cols-4 gap-3 md:gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.path)}
                className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1"
                aria-label={action.label}
              >
                {/* Updated icon color to indigo */}
                <span className="text-indigo-500 mb-1.5">{action.icon}</span>
                <span className="text-xs font-medium text-center text-gray-500">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* --- 3. Market Your App / Create Posters Card --- */}
        {/* Updated icon color, primary button style */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row items-center p-5 md:p-6">
            <div className="mb-3 md:mb-0 md:mr-4 flex-shrink-0 text-indigo-500">
              <PosterIcon className="h-9 w-9" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
                Market your app
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                Create & share posters to attract more students.
              </p>
              {/* Primary style button (solid indigo) */}
              <button
                onClick={()=>navigate("/share-poster")}
                className="inline-flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
              >
                <ShareIcon className="h-4 w-4" /> Start Sharing Posters
              </button>
            </div>
          </div>
        </div>

        {/* --- 4. Share Specific Content Card (Only if content exists) --- */}
        {/* Removed gradient header, added top border accent, updated button styles, input styles */}
        {sharedContent && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Added top border accent */}
            <div className="p-5 md:p-6 border-t-4 border-indigo-400">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
                Share This Content
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                Share this specific item easily.
              </p>

              <label className="block text-xs font-medium text-gray-500 mb-1">
                Content Preview:
              </label>
              <div className="mb-4 bg-gray-50 rounded-md border border-gray-200 p-3 text-sm text-gray-700 break-words max-h-32 overflow-y-auto">
                {sharedContent}
              </div>

              {/* Link Sharing Buttons - using secondary style */}
              <div className="flex flex-wrap gap-2 mb-5">
                <button
                  onClick={() =>
                    window.open(
                      contentShareLink,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  disabled={!contentShareLink}
                  title="Open link"
                  className={`flex items-center gap-1.5 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md hover:bg-indigo-200 transition-colors text-xs font-medium shadow-sm ${
                    !contentShareLink ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <ExternalLinkIcon className="h-4 w-4" /> Open
                </button>
                <button
                  onClick={() =>
                    shareViaWhatsApp(contentShareLink, "Check out this content")
                  }
                  disabled={!contentShareLink}
                  title="Share via WhatsApp"
                  className={`flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 transition-colors text-xs font-medium shadow-sm ${
                    !contentShareLink ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                </button>
                <button
                  onClick={() =>
                    copyToClipboard(contentShareLink, "Content link")
                  }
                  disabled={!contentShareLink}
                  title="Copy link"
                  className={`flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm ${
                    !contentShareLink ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <CopyLinkIcon className="h-4 w-4" /> Copy Link
                </button>
              </div>

              {/* Direct Share Section */}
              <hr className="my-4 border-t border-gray-200" />
              <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Or share directly in-app:
              </h3>
              {/* Using grid for layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Recipient Type:
                  </label>
                  {/* Updated toggle button styles */}
                  <div className="flex gap-2">
                    {["tutor", "student"].map((type) => (
                      <button
                        key={type}
                        className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
                          recipientType ===
                          (type === "student" ? "users" : "tutor")
                            ? "bg-indigo-500 border-indigo-500 text-white shadow-sm" // Active state
                            : "bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600" // Inactive state
                        }`}
                        onClick={() =>
                          setRecipientType(
                            type === "student" ? "users" : "tutor"
                          )
                        }
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="recipientId"
                    className="block text-xs font-medium text-gray-500 mb-1"
                  >
                    Recipient ID:
                  </label>
                  {/* Updated input focus style */}
                  <input
                    id="recipientId"
                    type="text"
                    value={selectedRecipient}
                    onChange={(e) => setSelectedRecipient(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm"
                    placeholder={`Enter ID`}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="shareMessage"
                  className="block text-xs font-medium text-gray-500 mb-1"
                >
                  Message (Optional):
                </label>
                {/* Updated textarea focus style */}
                <textarea
                  id="shareMessage"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm"
                  placeholder="Add a personal message..."
                  rows={2}
                />
              </div>
              {/* Primary button for send action */}
              <button
                onClick={handleDirectShare}
                disabled={!selectedRecipient || !currentUser}
                className={`w-full flex items-center justify-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <ShareIcon className="h-4 w-4" /> Send to{" "}
                {recipientType === "tutor" ? "Tutor" : "Student"}
              </button>
            </div>
          </div>
        )}

        {/* --- 5. Increase App Downloads / General Promotion Card --- */}
        {/* Updated button styles */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-1.5">
              Increase app downloads
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Share the app link to grow your audience.
            </p>
            <div className="flex flex-wrap gap-3">
              {/* Kept WhatsApp distinct green */}
              <button
                onClick={() =>
                  shareViaWhatsApp(appShareLink, "Check out this app")
                }
                className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 transition-colors text-xs font-medium shadow-sm"
              >
                <WhatsAppIcon className="h-4 w-4" /> Share App Link
              </button>
              {/* Using gray style for copy button */}
              <button
                onClick={() => copyToClipboard(appShareLink, "App link")}
                className="flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm"
              >
                <CopyLinkIcon className="h-4 w-4" /> Copy App Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Share;

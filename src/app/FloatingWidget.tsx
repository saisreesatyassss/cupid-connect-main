// import { JSX, useState } from "react";
// import { Plus } from "lucide-react";

// interface FloatingWidgetProps {
//   items: {
//     icon: JSX.Element;
//     onClick: () => void;
//   }[];
// } 

// const FloatingWidget: React.FC<FloatingWidgetProps> = ({ items }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="fixed bottom-6 right-6 flex flex-col items-end">
//       {/* Icons List */}
//       {isOpen && (
//         <div className="mb-3 flex flex-col items-end space-y-2 transition-all duration-300">
//           {items.map((item, index) => (
//             <button
//               key={index}
//               onClick={item.onClick}
//               className="fab-icon bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700 transition"
//             >
//               {item.icon}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Floating Button */}
//       <button
//         className="fab bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
//         onClick={() => setIsOpen((prev) => !prev)}
//       >
//         <Plus size={24} />
//       </button>
//     </div>
//   );
// };

// export default FloatingWidget;


import { JSX, useState } from "react";
import { Heart, HeartPulse, Gift, Music, X } from "lucide-react";

interface FloatingWidgetProps {
  items?: {
    icon: JSX.Element;
    onClick: () => void;
  }[];
}

const FloatingWidget: React.FC<FloatingWidgetProps> = ({ items = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Default Valentine's themed items if none provided
  const defaultItems = [
    {
      icon: <HeartPulse className="text-white" size={20} />,
      onClick: () => console.log("Send love message")
    },
    {
      icon: <Gift className="text-white" size={20} />,
      onClick: () => console.log("Send gift")
    },
    {
      icon: <Music className="text-white" size={20} />,
      onClick: () => console.log("Play love song")
    }
  ];

  const displayItems = items.length > 0 ? items : defaultItems;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
      {/* Floating hearts background */}
      {isOpen && (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="animate-float1 absolute -top-4 left-2">
            <Heart size={16} className="text-pink-400" fill="currentColor" />
          </div>
          <div className="animate-float2 absolute -top-8 right-4">
            <Heart size={12} className="text-pink-300" fill="currentColor" />
          </div>
          <div className="animate-float3 absolute -top-6 left-8">
            <Heart size={14} className="text-red-400" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Icons List */}
      {isOpen && (
        <div className="mb-3 flex flex-col items-end space-y-3 transition-all duration-300">
          {displayItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="transform hover:scale-110 bg-gradient-to-r from-pink-500 to-red-500 p-3 rounded-full text-white shadow-lg hover:shadow-pink-200/50 transition-all duration-300 animate-fadeIn"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {item.icon}
            </button>
          ))}
        </div>
      )}

      {/* Main Floating Button */}
      <button
        className="transform hover:scale-105 bg-gradient-to-r from-pink-500 to-red-500 p-4 rounded-full text-white shadow-lg hover:shadow-pink-200/50 transition-all duration-300"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <Heart size={24} className="text-white animate-pulse" fill="currentColor" />
        )}
      </button>
    </div>
  );
};

// Add required keyframes for the animations
const style = document.createElement('style');
style.textContent = `
  @keyframes float1 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(-20px, -100px) rotate(180deg); }
    100% { transform: translate(0, -200px) rotate(360deg); }
  }
  @keyframes float2 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(20px, -120px) rotate(-180deg); }
    100% { transform: translate(0, -240px) rotate(-360deg); }
  }
  @keyframes float3 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(-10px, -80px) rotate(90deg); }
    100% { transform: translate(0, -160px) rotate(180deg); }
  }
`;
document.head.appendChild(style);

// Add required Tailwind animations
const tailwindConfig = {
  theme: {
    extend: {
      animation: {
        float1: 'float1 3s ease-in-out infinite',
        float2: 'float2 4s ease-in-out infinite',
        float3: 'float3 3.5s ease-in-out infinite',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
      },
    },
  },
};

export default FloatingWidget;
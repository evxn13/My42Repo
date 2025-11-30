// path: srcs/frontend/srcs/website/src/components/chat/LiveMatchSection.tsx
import { FaCompressAlt } from 'react-icons/fa';

const LiveMatchSection = ({ closeLiveMatch }: { closeLiveMatch: () => void }) => {
    return (
        <div
            className="w-[300px] bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            style={{ animation: 'fadeIn 0.6s ease-in-out' }} // Slower fade-in animation
        >
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                }
            `}</style>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Live Match</h2>
                <button
                    onClick={() => {
                        closeLiveMatch();
                    }}
                    className="text-white hover:text-red-500 transition duration-300"
                >
                    <FaCompressAlt />
                </button>
            </div>
            <div className="space-y-4">
                <div className="p-4 bg-white/10 rounded-lg text-white hover:bg-white/20 transition duration-300">
                    <p className="font-bold">Drake vs Kendrick</p>
                    <p className="text-sm text-white/70">Score: 0 - 15</p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg text-white hover:bg-white/20 transition duration-300">
                    <p className="font-bold">Ye vs Jacob</p>
                    <p className="text-sm text-white/70">Score: 10 - 1</p>
                </div>
            </div>
        </div>
    );
};

export default LiveMatchSection;
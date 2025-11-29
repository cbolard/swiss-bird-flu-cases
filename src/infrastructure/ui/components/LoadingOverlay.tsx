import React from 'react';

const LoadingOverlay: React.FC = () => {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-swiss-bg">
            <div className="w-64 space-y-4">
                <div className="text-center space-y-1">
                    <h1 className="text-lg font-bold tracking-tight text-swiss-text">SWISS BIRD FLU</h1>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Initializing Data Layers</p>
                </div>

                {/* Swiss Style Loader: A simple, precise progress bar */}
                <div className="h-0.5 w-full bg-gray-200 overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-1/3 bg-swiss-red animate-[shimmer_1.5s_infinite_linear]"></div>
                </div>

                <div className="flex justify-between text-[9px] font-mono text-muted-foreground uppercase">
                    <span>Loading Geometry</span>
                    <span>Processing</span>
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const SwissSidebar: React.FC = () => {
    return (
        <div className="flex flex-col h-full font-sans text-swiss-text">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight mb-1">SWISS BIRD FLU</h1>
                <p className="text-xs uppercase text-muted-foreground tracking-widest">Epidemiology Dashboard</p>
            </div>

            {/* Intelligent Numbers */}
            <div className="grid grid-cols-1 gap-6 mb-8">
                <div>
                    <p className="text-xs uppercase text-muted-foreground mb-1">Total Cases</p>
                    <div className="text-6xl font-bold text-swiss-red tracking-tighter leading-none">1,248</div>
                </div>
                <div>
                    <p className="text-xs uppercase text-muted-foreground mb-1">Active Zones</p>
                    <div className="text-6xl font-bold text-swiss-text tracking-tighter leading-none">12</div>
                </div>
            </div>

            <Separator className="my-6" />

            {/* Cantons List */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <h2 className="text-xs font-bold uppercase tracking-widest mb-4 text-muted-foreground">Affected Cantons</h2>
                <ScrollArea className="flex-1 -mr-4 pr-4">
                    <div className="space-y-2">
                        {['Zurich', 'Bern', 'Vaud', 'Geneva', 'Lucerne', 'Basel', 'Ticino'].map((canton) => (
                            <div key={canton} className="flex items-center justify-between group cursor-pointer hover:bg-swiss-bg/50 p-3 rounded-sm transition-all border border-transparent hover:border-gray-100">
                                <div>
                                    <div className="font-medium text-sm">{canton}</div>
                                    <div className="text-[10px] uppercase text-muted-foreground">24 Active Cases</div>
                                </div>
                                <div className="h-6 w-12 flex items-end gap-0.5 opacity-50 group-hover:opacity-100 transition-opacity">
                                    {/* Fake Sparkline */}
                                    <div className="flex-1 bg-swiss-red h-[20%]"></div>
                                    <div className="flex-1 bg-swiss-red h-[40%]"></div>
                                    <div className="flex-1 bg-swiss-red h-[30%]"></div>
                                    <div className="flex-1 bg-swiss-red h-[80%]"></div>
                                    <div className="flex-1 bg-swiss-red h-[60%]"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default SwissSidebar;

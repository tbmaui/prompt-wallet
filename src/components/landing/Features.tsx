import { Search, Layers, Shield } from 'lucide-react';

const features = [
    {
        icon: Search,
        title: 'Smart Search',
        description: 'Find the perfect prompt in seconds with our advanced filtering and fuzzy search capabilities.'
    },
    {
        icon: Layers,
        title: 'Organized Library',
        description: 'Keep your prompts structured with custom tags, categories, and variables for easy reuse.'
    },
    {
        icon: Shield,
        title: 'Privacy First',
        description: 'Your prompts are stored locally on your device. We don\'t track or train on your personal data.'
    }
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-white dark:bg-black/50 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to master AI</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Built for power users who demand precision and organization in their generative AI workflow.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-8 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-white/5 hover:border-indigo-500/50 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

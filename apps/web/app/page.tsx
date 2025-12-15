'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggle } from '../components/theme-toggle';

export default function LandingPage() {
    const [hoveredStep, setHoveredStep] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
            {/* Header */}
            <header className="flex h-20 items-center justify-between border-b border-blue-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-8 shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:shadow-blue-600/50 transition-all duration-300 group-hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </div>
                            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900 animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-blue-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                NBFC Loan Assistant
                            </h1>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">AI-Powered Assistant</p>
                        </div>
                    </Link>
                </div>
                <ThemeToggle />
            </header>

            {/* Hero Section */}
            <section className="relative px-6 py-20 md:py-32 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold mb-6 animate-fadeIn border border-blue-200 dark:border-blue-800">
                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
                        AI-Powered Solution
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-blue-900 dark:text-white mb-8 leading-tight animate-slideUp">
                        AI-Based Loan
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                            Chatbot Platform
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-slideUp" style={{ animationDelay: '0.1s' }}>
                        Experience the future of loan applications with our AI-driven chatbot that streamlines the entire process from start to finish.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
                        <Link
                            href="/chat"
                            className="group px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-105 flex items-center gap-2"
                        >
                            Get Started
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </Link>
                        <button className="px-8 py-4 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 text-lg font-semibold rounded-xl border-2 border-blue-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm hover:shadow-md">
                            Watch Demo
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
                        {[
                            { value: '98%', label: 'Approval Rate' },
                            { value: '< 5min', label: 'Average Time' },
                            { value: '24/7', label: 'Availability' }
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center animate-slideUp" style={{ animationDelay: `${0.3 + idx * 0.1}s` }}>
                                <div className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-white mb-2">{stat.value}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Project Overview Section */}
            <section className="px-6 py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-blue-900 dark:text-white mb-6">
                            Intelligent Loan Processing
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Our AI-powered system revolutionizes the loan application experience
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                ),
                                title: 'AI Master Agent',
                                description: 'Intelligent conversation flow that understands context and guides users through the application process seamlessly.'
                            },
                            {
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                ),
                                title: 'Worker Agents',
                                description: 'Specialized agents handle verification, underwriting, and document generation with precision and speed.'
                            },
                            {
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                ),
                                title: 'Secure Processing',
                                description: 'Enterprise-grade security ensures your data is protected throughout the entire application journey.'
                            }
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className="group p-8 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-blue-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="w-16 h-16 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-blue-600/20">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-blue-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="px-6 py-20 bg-gradient-to-br from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-blue-900 dark:text-white mb-6">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Five simple steps to get your loan approved
                        </p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-6">
                        {[
                            { step: 1, title: 'Open Chatbot', desc: 'Start a conversation with our AI assistant', icon: '💬' },
                            { step: 2, title: 'Provide Details', desc: 'Share your loan requirements', icon: '📝' },
                            { step: 3, title: 'Verification', desc: 'Automated identity check', icon: '✅' },
                            { step: 4, title: 'Eligibility Check', desc: 'AI-powered underwriting', icon: '🔍' },
                            { step: 5, title: 'Get Decision', desc: 'Instant loan approval', icon: '🎉' }
                        ].map((item) => (
                            <div
                                key={item.step}
                                onMouseEnter={() => setHoveredStep(item.step)}
                                onMouseLeave={() => setHoveredStep(null)}
                                className={`relative p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all duration-300 ${hoveredStep === item.step
                                    ? 'border-blue-500 shadow-xl scale-105 -translate-y-2'
                                    : 'border-blue-100 dark:border-gray-700 shadow-md'
                                    }`}
                            >
                                <div className={`text-4xl mb-4 transition-all duration-300 ${hoveredStep === item.step ? 'scale-125' : 'scale-100'
                                    }`}>
                                    {item.icon}
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mb-4 transition-all duration-300 ${hoveredStep === item.step
                                    ? 'bg-blue-600 text-white scale-110'
                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    }`}>
                                    {item.step}
                                </div>
                                <h3 className="font-bold text-blue-900 dark:text-white mb-2 text-lg">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.desc}
                                </p>

                                {item.step < 5 && (
                                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 text-blue-300 dark:text-blue-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Stack Section */}
            <section className="px-6 py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-blue-900 dark:text-white mb-6">
                            Built with Modern Technology
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Powered by industry-leading tools and frameworks
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: 'Frontend', tech: 'Next.js', color: 'from-blue-500 to-blue-600' },
                            { title: 'Backend', tech: 'Node.js', color: 'from-green-500 to-green-600' },
                            { title: 'AI Engine', tech: 'LangChain', color: 'from-purple-500 to-purple-600' },
                            { title: 'Database', tech: 'PostgreSQL', color: 'from-indigo-500 to-indigo-600' }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="group relative p-8 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-blue-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`} />
                                <div className="relative">
                                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
                                        {item.title}
                                    </p>
                                    <p className="text-3xl font-bold text-blue-900 dark:text-white">
                                        {item.tech}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 py-24 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-gray-900 text-white relative overflow-hidden transition-colors duration-300">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Transform Your Loan Experience?
                    </h2>
                    <p className="text-xl text-blue-100 dark:text-gray-300 mb-10 leading-relaxed">
                        Join thousands of satisfied customers who got their loans approved in minutes
                    </p>
                    <Link
                        href="/chat"
                        className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
                    >
                        Start Your Application
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 py-8 bg-blue-900 dark:bg-gray-950 text-center border-t border-blue-800 dark:border-gray-800 transition-colors duration-300">
                <p className="text-blue-200 dark:text-gray-400 text-sm">
                    © 2025 AI Loan Chatbot Platform. Powered by advanced AI technology.
                </p>
            </footer>
        </div>
    );
}

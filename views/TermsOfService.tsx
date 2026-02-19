import React, { useEffect } from 'react';
import PublicPageLayout from '../components/PublicPageLayout';

const TermsOfService: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <PublicPageLayout>
            <main className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-16 text-center">
                        <div className="inline-block mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-primary tracking-widest uppercase">Legal</div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Terms of Service</h1>
                        <p className="text-text-secondary">Last updated: February 19, 2026</p>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none space-y-10">

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                            <p className="text-text-secondary leading-relaxed">
                                By accessing or using DraftMind Studio ("Service"), operated by DraftMind Studio Inc. ("we," "our," or "us"), you agree to be
                                bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, do not access or use the Service.
                                These Terms apply to all visitors, users, and others who access or use the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
                            <p className="text-text-secondary leading-relaxed">
                                DraftMind Studio is an AI-powered writing workspace that provides tools for content creation, including a rich text editor,
                                AI writing assistant, templates, project management, and analytics. The Service is available through our website and may be
                                accessed via web browsers on desktop and mobile devices.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Account Registration</h2>
                            <ul className="list-disc list-inside space-y-2 text-text-secondary">
                                <li>You must be at least 13 years old to create an account.</li>
                                <li>You must provide accurate, current, and complete information during registration.</li>
                                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                                <li>You are responsible for all activities that occur under your account.</li>
                                <li>You must notify us immediately of any unauthorized use of your account.</li>
                                <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. User Content</h2>

                            <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.1 Ownership</h3>
                            <p className="text-text-secondary leading-relaxed">
                                You retain full ownership of all content you create, upload, or store through the Service ("User Content"). We do not claim
                                any intellectual property rights over your User Content. What you create is yours.
                            </p>

                            <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.2 License to Us</h3>
                            <p className="text-text-secondary leading-relaxed">
                                By using the Service, you grant us a limited, non-exclusive, worldwide license to host, store, transmit, and display your
                                User Content solely for the purpose of operating and providing the Service to you. This license terminates when you delete
                                your content or account.
                            </p>

                            <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.3 Content Responsibilities</h3>
                            <p className="text-text-secondary leading-relaxed">You agree not to upload, create, or share content that:</p>
                            <ul className="list-disc list-inside space-y-2 text-text-secondary mt-3">
                                <li>Infringes on any third party's intellectual property rights</li>
                                <li>Contains malware, viruses, or harmful code</li>
                                <li>Is unlawful, defamatory, obscene, or otherwise objectionable</li>
                                <li>Violates the privacy or rights of others</li>
                                <li>Constitutes spam, phishing, or deceptive practices</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. AI-Generated Content</h2>
                            <p className="text-text-secondary leading-relaxed mb-4">
                                DraftMind Studio includes AI-powered writing features. Regarding AI-generated content:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-text-secondary">
                                <li>AI-generated content is provided as suggestions and should be reviewed before use.</li>
                                <li>We do <strong className="text-white">not</strong> guarantee the accuracy, originality, or legal compliance of AI-generated content.</li>
                                <li>You are solely responsible for reviewing, editing, and verifying any AI-generated content before publishing or distributing it.</li>
                                <li>We do <strong className="text-white">not</strong> use your User Content to train our AI models.</li>
                                <li>AI features may be subject to usage limits based on your subscription plan.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Subscription Plans and Billing</h2>

                            <h3 className="text-xl font-semibold text-white mb-3 mt-6">6.1 Free Plan</h3>
                            <p className="text-text-secondary leading-relaxed">
                                The free plan provides limited access to the Service. Features and usage limits are described on our Pricing page.
                            </p>

                            <h3 className="text-xl font-semibold text-white mb-3 mt-6">6.2 Paid Plans</h3>
                            <ul className="list-disc list-inside space-y-2 text-text-secondary">
                                <li>Paid subscriptions are billed in advance on a monthly or annual basis.</li>
                                <li>All prices are listed in Indian Rupees (₹) unless otherwise specified.</li>
                                <li>Prices are subject to change with 30 days' prior notice.</li>
                                <li>Payments are processed through secure third-party payment processors.</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-white mb-3 mt-6">6.3 Refunds</h3>
                            <p className="text-text-secondary leading-relaxed">
                                We offer a 7-day refund policy for paid plans. If you are not satisfied with the Service within the first 7 days of your
                                subscription, contact us for a full refund. After 7 days, subscriptions are non-refundable. Pro-rata refunds are not available
                                for partial months.
                            </p>

                            <h3 className="text-xl font-semibold text-white mb-3 mt-6">6.4 Cancellation</h3>
                            <p className="text-text-secondary leading-relaxed">
                                You may cancel your subscription at any time from your account settings. Upon cancellation, you will retain access to paid
                                features until the end of your current billing period. After that, your account will revert to the free plan.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">7. Acceptable Use</h2>
                            <p className="text-text-secondary leading-relaxed mb-4">You agree not to:</p>
                            <ul className="list-disc list-inside space-y-2 text-text-secondary">
                                <li>Use the Service for any illegal purpose or in violation of any applicable laws</li>
                                <li>Attempt to gain unauthorized access to the Service or its systems</li>
                                <li>Interfere with or disrupt the integrity or performance of the Service</li>
                                <li>Use automated means (bots, scrapers) to access or collect data from the Service</li>
                                <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                                <li>Resell, sublicense, or redistribute the Service without written permission</li>
                                <li>Use the AI features to generate content that promotes violence, hatred, or discrimination</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">8. Intellectual Property</h2>
                            <p className="text-text-secondary leading-relaxed">
                                The Service, including its original content (excluding User Content), features, and functionality, is and will remain the
                                exclusive property of DraftMind Studio Inc. The Service is protected by copyright, trademark, and other intellectual property
                                laws. Our trademarks, logos, and service names may not be used without our prior written consent.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">9. Disclaimer of Warranties</h2>
                            <div className="p-6 rounded-xl bg-surface-dark border border-border-dark">
                                <p className="text-text-secondary leading-relaxed">
                                    THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,
                                    INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND
                                    TITLE. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT DEFECTS WILL BE CORRECTED.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h2>
                            <div className="p-6 rounded-xl bg-surface-dark border border-border-dark">
                                <p className="text-text-secondary leading-relaxed">
                                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL DRAFTMIND STUDIO INC., ITS FOUNDER, AFFILIATES,
                                    DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                                    INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS
                                    TO OR USE OF (OR INABILITY TO USE) THE SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU TO US IN THE
                                    TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE LIABILITY.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">11. Indemnification</h2>
                            <p className="text-text-secondary leading-relaxed">
                                You agree to defend, indemnify, and hold harmless DraftMind Studio Inc. and its founder, employees, and agents from any
                                claims, damages, losses, or expenses (including reasonable attorney fees) arising from your use of the Service, your violation
                                of these Terms, or your violation of any rights of a third party.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">12. Termination</h2>
                            <p className="text-text-secondary leading-relaxed">
                                We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any
                                reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately. You may export
                                your data before termination. We will retain your data for 30 days after termination, after which it will be permanently deleted.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">13. Governing Law</h2>
                            <p className="text-text-secondary leading-relaxed">
                                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                                Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Pune, Maharashtra, India.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">14. Changes to Terms</h2>
                            <p className="text-text-secondary leading-relaxed">
                                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days'
                                notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                                Your continued use of the Service after changes take effect constitutes acceptance of the revised Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">15. Contact Us</h2>
                            <p className="text-text-secondary leading-relaxed">
                                If you have any questions about these Terms, please contact us:
                            </p>
                            <div className="mt-4 p-6 rounded-xl bg-surface-dark border border-border-dark">
                                <p className="text-white font-bold mb-2">DraftMind Studio</p>
                                <p className="text-text-secondary">Email: <a href="mailto:tahirtai147@gmail.com" className="text-primary hover:underline">tahirtai147@gmail.com</a></p>
                                <p className="text-text-secondary">Founder: Taheer Tai</p>
                            </div>
                        </section>

                    </div>
                </div>
            </main>
        </PublicPageLayout>
    );
};

export default TermsOfService;

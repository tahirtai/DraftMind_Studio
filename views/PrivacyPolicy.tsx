import React, { useEffect } from 'react';
import PublicPageLayout from '../components/PublicPageLayout';

const PrivacyPolicy: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <PublicPageLayout>
            <main className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-16 text-center">
                        <div className="inline-block mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-primary tracking-widest uppercase">Legal</div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Privacy Policy</h1>
                        <p className="text-text-secondary">Last updated: February 19, 2026</p>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none space-y-10">

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                            <p className="text-text-secondary leading-relaxed">
                                Welcome to DraftMind Studio ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application and services
                                (collectively, the "Service"). By using the Service, you agree to the collection and use of information in accordance with this policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>

                            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.1 Personal Information</h3>
                            <p className="text-text-secondary leading-relaxed mb-4">
                                When you register for an account, we may collect the following personal information:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-text-secondary">
                                <li>Full name and display name</li>
                                <li>Email address</li>
                                <li>Profile picture (if uploaded)</li>
                                <li>Authentication credentials (managed securely via Supabase Auth)</li>
                                <li>Billing information (processed securely via third-party payment processors)</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2 Usage Data</h3>
                            <p className="text-text-secondary leading-relaxed mb-4">We automatically collect certain information when you access and use the Service:</p>
                            <ul className="list-disc list-inside space-y-2 text-text-secondary">
                                <li>Browser type and version</li>
                                <li>Operating system</li>
                                <li>Pages visited and time spent on pages</li>
                                <li>Referring website addresses</li>
                                <li>IP address (anonymized where possible)</li>
                                <li>Device identifiers</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.3 Content Data</h3>
                            <p className="text-text-secondary leading-relaxed">
                                We store the content you create within the Service, including documents, projects, and notes. This content is stored securely and is
                                only accessible by you unless you choose to share it. We do <strong className="text-white">not</strong> use your content to train AI models.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                            <p className="text-text-secondary leading-relaxed mb-4">We use the information we collect for the following purposes:</p>
                            <ul className="list-disc list-inside space-y-2 text-text-secondary">
                                <li><strong className="text-white">Providing the Service:</strong> To operate, maintain, and deliver the features and functionality of DraftMind Studio.</li>
                                <li><strong className="text-white">Account Management:</strong> To manage your account, process payments, and provide customer support.</li>
                                <li><strong className="text-white">Improvement:</strong> To understand usage patterns and improve the Service, including AI model performance.</li>
                                <li><strong className="text-white">Communication:</strong> To send you updates, security alerts, and support messages. We will never spam you.</li>
                                <li><strong className="text-white">Security:</strong> To detect, prevent, and address technical issues, fraud, and security breaches.</li>
                                <li><strong className="text-white">Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing and Disclosure</h2>
                            <p className="text-text-secondary leading-relaxed mb-4">
                                We do <strong className="text-white">not</strong> sell your personal information. We may share your information in the following limited circumstances:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-text-secondary">
                                <li><strong className="text-white">Service Providers:</strong> With third-party vendors who perform services on our behalf (e.g., Supabase for hosting, Google for AI features, payment processors).</li>
                                <li><strong className="text-white">Legal Requirements:</strong> When required by law, subpoena, or government request.</li>
                                <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of all or a portion of our assets.</li>
                                <li><strong className="text-white">With Your Consent:</strong> When you explicitly authorize us to share your data.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                            <p className="text-text-secondary leading-relaxed">
                                We implement industry-standard security measures to protect your data, including:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-text-secondary mt-4">
                                <li>End-to-end encryption for data in transit (TLS 1.3)</li>
                                <li>Encryption at rest for stored data (AES-256)</li>
                                <li>Regular security audits and penetration testing</li>
                                <li>Role-based access controls for our internal teams</li>
                                <li>Multi-factor authentication support</li>
                            </ul>
                            <p className="text-text-secondary leading-relaxed mt-4">
                                While we strive to protect your data, no method of electronic storage or transmission is 100% secure. We cannot guarantee absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Cookies and Tracking</h2>
                            <p className="text-text-secondary leading-relaxed">
                                We use essential cookies to keep you logged in and remember your preferences. We use minimal analytics tracking to understand
                                how the Service is used. We do <strong className="text-white">not</strong> use third-party advertising trackers. You can manage cookie preferences in your browser settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
                            <p className="text-text-secondary leading-relaxed mb-4">Depending on your location, you may have the following rights:</p>
                            <ul className="list-disc list-inside space-y-2 text-text-secondary">
                                <li><strong className="text-white">Access:</strong> Request a copy of the personal data we hold about you.</li>
                                <li><strong className="text-white">Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                                <li><strong className="text-white">Deletion:</strong> Request deletion of your personal data ("right to be forgotten").</li>
                                <li><strong className="text-white">Portability:</strong> Request your data in a structured, commonly used format.</li>
                                <li><strong className="text-white">Objection:</strong> Object to the processing of your data for certain purposes.</li>
                                <li><strong className="text-white">Withdraw Consent:</strong> Withdraw consent at any time where we rely on consent for processing.</li>
                            </ul>
                            <p className="text-text-secondary leading-relaxed mt-4">
                                To exercise any of these rights, contact us at <a href="mailto:tahirtai147@gmail.com" className="text-primary hover:underline">tahirtai147@gmail.com</a>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">8. Data Retention</h2>
                            <p className="text-text-secondary leading-relaxed">
                                We retain your personal data for as long as your account is active or as needed to provide you with the Service.
                                If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or
                                regulatory purposes. Anonymized, aggregated data may be retained indefinitely for analytics purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
                            <p className="text-text-secondary leading-relaxed">
                                DraftMind Studio is not intended for children under the age of 13. We do not knowingly collect personal information from children
                                under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such
                                information promptly.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
                            <p className="text-text-secondary leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on
                                this page and updating the "Last updated" date. Your continued use of the Service after changes are posted constitutes your
                                acceptance of the revised policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
                            <p className="text-text-secondary leading-relaxed">
                                If you have any questions or concerns about this Privacy Policy, please contact us:
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

export default PrivacyPolicy;

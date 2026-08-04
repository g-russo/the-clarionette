import PageLayout from "@/components/PageLayout";

export const metadata = {
  title: "Privacy Policy — The Beacon",
  description: "How The Beacon collects, uses, and protects information from readers and contributors.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 pb-8 border-b border-gray-200">
          <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Legal</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: July 2026 · Harrow Hill High School, Manila</p>
        </div>

        <div className="space-y-10">
          <Section title="Overview">
            <p>
              The Beacon is the official student publication of Harrow Hill High School. This Privacy Policy
              explains what limited information we collect when you visit our website and how it is used.
              We are committed to protecting your privacy and will never sell, rent, or trade your personal
              information to third parties.
            </p>
          </Section>

          <Section title="Information We Collect">
            <p>We collect only the minimum information necessary to operate the site:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong>Comments:</strong> When you leave a comment, we collect your name, an optional email
                address (not published), and your comment text. Email addresses are used solely to notify
                you if your comment receives a reply, and are never displayed publicly.
              </li>
              <li>
                <strong>Newsletter subscriptions:</strong> If you subscribe to our newsletter, we store your
                email address to send publication updates. You may unsubscribe at any time.
              </li>
              <li>
                <strong>Server logs:</strong> Like all web servers, ours automatically records basic access
                information (IP address, browser type, pages visited, timestamps) for security and
                operational purposes. These logs are not linked to individual identities.
              </li>
            </ul>
          </Section>

          <Section title="How We Use Your Information">
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>To display and moderate reader comments</li>
              <li>To send newsletters to subscribers who have opted in</li>
              <li>To diagnose technical problems and maintain site security</li>
            </ul>
            <p>We do not use your information for advertising, profiling, or any commercial purpose.</p>
          </Section>

          <Section title="Cookies">
            <p>
              Our website may use a small number of session cookies necessary for the site to function
              (for example, to remember your comment form details within a session). We do not use
              third-party advertising or tracking cookies. Your browser settings allow you to refuse
              cookies, though this may affect some site functionality.
            </p>
          </Section>

          <Section title="Third-Party Services">
            <p>
              We use Supabase for media file storage. Uploaded images are served from Supabase's CDN.
              Please review <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Supabase's Privacy Policy</a> for
              details on how they handle data.
            </p>
            <p>
              Our website does not embed third-party analytics scripts, social media tracking pixels,
              or advertising networks.
            </p>
          </Section>

          <Section title="Data Retention">
            <p>
              Comment data is retained as long as the associated article is published. You may request
              removal of your comment or associated email at any time by contacting us. Server logs are
              retained for up to 90 days.
            </p>
          </Section>

          <Section title="Children's Privacy">
            <p>
              Our website is operated by and for members of the Harrow Hill High School community,
              including students of all ages. We do not knowingly collect personal information beyond
              what is described above, and we take extra care to limit data collection in all cases.
            </p>
          </Section>

          <Section title="Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Request access to any personal data we hold about you</li>
              <li>Request correction or deletion of your personal data</li>
              <li>Unsubscribe from our newsletter at any time</li>
              <li>Request removal of any comment you submitted</li>
            </ul>
          </Section>

          <Section title="Contact Us">
            <p>
              For any privacy-related concerns, please contact us at{" "}
              <a href="mailto:thebeacon@harrowhill.edu" className="text-red-600 hover:underline">
                thebeacon@harrowhill.edu
              </a>
              . We will respond within 10 school days.
            </p>
          </Section>

          <Section title="Changes to This Policy">
            <p>
              We may update this policy from time to time. Any significant changes will be announced
              on our website. Continued use of the site after changes are posted constitutes your
              acceptance of the updated policy.
            </p>
          </Section>
        </div>
      </div>
    </PageLayout>
  );
}

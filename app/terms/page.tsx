import PageLayout from "@/components/PageLayout";

export const metadata = {
  title: "Terms of Service — The Beacon",
  description: "Terms and conditions for using The Beacon website.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 pb-8 border-b border-gray-200">
          <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Legal</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Terms of Service</h1>
          <p className="text-sm text-gray-500">Last updated: July 2026 · Harrow Hill High School, Manila</p>
        </div>

        <div className="space-y-10">
          <Section title="Acceptance of Terms">
            <p>
              By accessing and using The Beacon website (<em>thebeacon.harrowhill.edu</em>),
              you agree to be bound by these Terms of Service. If you do not agree, please discontinue
              use of the site. These terms apply to all visitors, readers, and contributors.
            </p>
          </Section>

          <Section title="Nature of the Publication">
            <p>
              The Beacon is a student-run publication of Harrow Hill High School. All content is
              produced by student journalists under the guidance of faculty advisers. Articles represent
              the views of the individual authors or the editorial board, and do not necessarily reflect
              the official positions of Harrow Hill High School.
            </p>
          </Section>

          <Section title="Intellectual Property">
            <p>
              All original content published on this website — including articles, photographs, illustrations,
              and graphics — is the intellectual property of The Beacon and its student authors.
              You may share links to our articles and quote excerpts (with attribution) for
              non-commercial, educational purposes. Full reproduction of articles without prior written
              permission is not permitted.
            </p>
            <p>
              When submitting content to The Beacon, contributors grant us a non-exclusive license
              to publish, edit, and archive the submitted work.
            </p>
          </Section>

          <Section title="Reader Comments">
            <p>
              Comments submitted through our website are subject to moderation. By posting a comment,
              you agree that:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Your comment does not contain false, defamatory, or misleading statements</li>
              <li>Your comment does not harass, bully, or target any individual</li>
              <li>Your comment does not contain profanity, hate speech, or discriminatory language</li>
              <li>Your comment does not spam, advertise, or promote unrelated products or services</li>
            </ul>
            <p>
              We reserve the right to remove any comment that violates these guidelines, without notice.
              Repeated violations may result in a permanent block from the comment system.
            </p>
          </Section>

          <Section title="Accuracy and Corrections">
            <p>
              We strive for accuracy in all of our reporting. If you believe a factual error has been
              published, please contact us at{" "}
              <a href="mailto:thebeacon@harrowhill.edu" className="text-red-600 hover:underline">
                thebeacon@harrowhill.edu
              </a>
              . We will review the claim and issue a correction if warranted.
            </p>
          </Section>

          <Section title="External Links">
            <p>
              Our website may contain links to external sites. We are not responsible for the content,
              accuracy, or privacy practices of third-party websites. Inclusion of a link does not imply
              endorsement.
            </p>
          </Section>

          <Section title="Disclaimer of Warranties">
            <p>
              The Beacon website is provided "as is." We make no warranties, express or implied,
              regarding the availability, accuracy, or completeness of the content. We are not liable
              for any direct or indirect damages arising from your use of the site.
            </p>
          </Section>

          <Section title="Governing Policy">
            <p>
              These terms are governed by and construed in accordance with applicable laws of the
              Philippines and the policies of Harrow Hill High School. Any disputes shall be resolved
              through good-faith discussion between parties.
            </p>
          </Section>

          <Section title="Changes to These Terms">
            <p>
              We may revise these Terms of Service at any time. Updated terms will be posted to this
              page with a revised effective date. Continued use of the site constitutes acceptance of
              the revised terms.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about these terms may be directed to{" "}
              <a href="mailto:thebeacon@harrowhill.edu" className="text-red-600 hover:underline">
                thebeacon@harrowhill.edu
              </a>
              .
            </p>
          </Section>
        </div>
      </div>
    </PageLayout>
  );
}

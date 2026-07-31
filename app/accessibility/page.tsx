import PageLayout from "@/components/PageLayout";
import { Mail } from "lucide-react";

export const metadata = {
  title: "Accessibility — The Beacon",
  description: "Our commitment to making The Beacon accessible to all readers.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function AccessibilityPage() {
  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 pb-8 border-b border-gray-200">
          <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Accessibility</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Accessibility Statement</h1>
          <p className="text-sm text-gray-500">Last updated: July 2026</p>
        </div>

        <div className="space-y-10">
          <Section title="Our Commitment">
            <p>
              The Beacon is committed to making our website accessible to everyone, including
              readers with disabilities. We believe quality journalism should be available to all
              members of our school community, regardless of ability or the assistive technology
              they use.
            </p>
            <p>
              We aim to conform to the{" "}
              <strong>Web Content Accessibility Guidelines (WCAG) 2.1, Level AA</strong>. These
              guidelines explain how to make web content more accessible to people with disabilities,
              including those with visual, auditory, motor, and cognitive impairments.
            </p>
          </Section>

          <Section title="Features Supporting Accessibility">
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong>Keyboard navigation:</strong> All interactive elements — links, buttons, and
                form fields — are reachable and operable using a keyboard alone.
              </li>
              <li>
                <strong>Screen reader support:</strong> Pages use semantic HTML elements and ARIA
                labels where appropriate to ensure compatibility with screen readers such as NVDA,
                JAWS, and VoiceOver.
              </li>
              <li>
                <strong>Text alternatives:</strong> All images include descriptive alt text. Images
                used purely for decoration are marked so they are skipped by assistive technology.
              </li>
              <li>
                <strong>Colour contrast:</strong> Text and interactive elements meet WCAG AA contrast
                ratios (4.5:1 for body text, 3:1 for large text and UI components).
              </li>
              <li>
                <strong>Resizable text:</strong> The site is fully functional when browser text size
                is increased up to 200%.
              </li>
              <li>
                <strong>Responsive design:</strong> All pages are fully usable on mobile and tablet
                devices, including those using touch or switch access.
              </li>
              <li>
                <strong>Motion:</strong> We respect the{" "}
                <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">prefers-reduced-motion</code>{" "}
                browser setting. Animations are reduced or removed for users who have requested
                minimal motion.
              </li>
            </ul>
          </Section>

          <Section title="Known Limitations">
            <p>
              While we work toward full accessibility, some areas are still being improved:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                Some older archived articles may contain images without alt text. We are working
                to retroactively add descriptions to these images.
              </li>
              <li>
                Rich article layouts (photo essays with carousels) may present challenges for
                some screen reader users. We are actively improving the keyboard and ARIA
                experience for these formats.
              </li>
            </ul>
          </Section>

          <Section title="Third-Party Content">
            <p>
              Some content on this site is provided by third parties (embedded videos, external links).
              We cannot guarantee the accessibility of external websites or embedded content beyond
              our control, but we encourage our partners to maintain accessible practices.
            </p>
          </Section>

          <Section title="Technical Specifications">
            <p>
              This website is built with React and Next.js and relies on the following standards
              for accessibility:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>HTML5 semantic elements (<code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">main</code>, <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">nav</code>, <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">article</code>, <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">aside</code>, <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">footer</code>)</li>
              <li>WAI-ARIA roles and properties where native semantics are insufficient</li>
              <li>CSS respecting <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">prefers-color-scheme</code> and <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">prefers-reduced-motion</code> media queries</li>
            </ul>
          </Section>

          <Section title="Feedback and Contact">
            <p>
              We welcome feedback on the accessibility of this website. If you encounter a barrier
              that prevents you from accessing any part of our site, please let us know so we can
              address it.
            </p>
            <div className="mt-4 p-5 bg-red-50 border border-red-100 rounded-xl">
              <p className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                <Mail size={16} className="text-red-600" />
                Contact us about accessibility
              </p>
              <p className="text-sm">
                Email:{" "}
                <a href="mailto:thebeacon@harrowhill.edu" className="text-red-600 hover:underline font-medium">
                  thebeacon@harrowhill.edu
                </a>
              </p>
              <p className="text-sm mt-1 text-gray-500">
                We aim to respond to accessibility feedback within 10 school days.
              </p>
            </div>
          </Section>
        </div>
      </div>
    </PageLayout>
  );
}

import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { Mail, FileText, Newspaper, Feather, BookOpen, Star, CheckCircle, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Submit a Story — The Beacon",
  description: "How to pitch a story, submit a letter to the editor, or contribute to The Beacon.",
};

const CONTRIBUTION_TYPES = [
  {
    icon: Newspaper,
    title: "News Tip",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-700",
    desc: "Know about something happening on campus or in the community? Share a news tip with our reporters. Tips are kept confidential unless you agree to be identified as a source.",
  },
  {
    icon: Feather,
    title: "Opinion or Editorial",
    color: "bg-purple-50 border-purple-200",
    accent: "text-purple-700",
    desc: "Have a perspective on a school issue, community event, or current topic? We publish opinion pieces and guest editorials from students and faculty.",
  },
  {
    icon: BookOpen,
    title: "Literary Submission",
    color: "bg-amber-50 border-amber-200",
    accent: "text-amber-700",
    desc: "Submit original poetry, short fiction, personal essays, or creative non-fiction for our Literary section. Works may be in English or Filipino.",
  },
  {
    icon: Star,
    title: "Letter to the Editor",
    color: "bg-slate-50 border-slate-200",
    accent: "text-slate-700",
    desc: "React to a story we published, share your take on an issue, or commend someone in our community. Letters are typically 150–300 words.",
  },
];

const GUIDELINES = [
  "All submissions must be original, unpublished work.",
  "Include your full name, grade or position, and contact information.",
  "Opinion pieces should be 400–800 words. Literary submissions have no hard limit, but concise work is preferred.",
  "Submissions may be edited for length, clarity, and style.",
  "The editorial board reserves the right to decline submissions that do not meet our standards or are outside our scope.",
  "We aim to respond to all submissions within 5 school days.",
];

export default function SubmitPage() {
  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-10 pb-8 border-b border-gray-200">
          <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Get Involved</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Submit a Story</h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            The Beacon is a student publication — its quality depends on the stories our community brings to us.
            We welcome tips, contributions, and feedback from students, faculty, and alumni.
          </p>
        </div>

        {/* Contribution types */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-5">What Can You Submit?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {CONTRIBUTION_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.title} className={`p-5 rounded-xl border ${type.color}`}>
                  <div className={`flex items-center gap-2 mb-2 font-bold ${type.accent}`}>
                    <Icon size={16} />
                    {type.title}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{type.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guidelines */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Submission Guidelines</h2>
          <ul className="space-y-3">
            {GUIDELINES.map((g, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600">
                <CheckCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                <span className="text-sm leading-relaxed">{g}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* How to submit */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-5">How to Submit</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Send your submission or tip to our editorial email. Please use a clear subject line indicating
            the type of submission (e.g., <em>"News Tip: Student Council Elections"</em> or
            <em>"Opinion: School Uniform Policy"</em>).
          </p>

          <div className="p-6 bg-red-50 border border-red-100 rounded-xl">
            <p className="font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Mail size={16} className="text-red-600" />
              Editorial Email
            </p>
            <a
              href="mailto:thebeacon@harrowhill.edu?subject=Story Submission"
              className="text-red-600 hover:underline font-semibold text-lg"
            >
              thebeacon@harrowhill.edu
            </a>
            <p className="mt-3 text-sm text-gray-500">
              You may also approach any member of The Beacon editorial board in person.
              Find our current staff on the{" "}
              <Link href="/editorial-board" className="text-red-600 hover:underline">
                Editorial Board
              </Link>{" "}
              page.
            </p>
          </div>
        </div>

        {/* What to expect */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-5">What Happens After You Submit?</h2>
          <ol className="space-y-4">
            {[
              { step: "1", label: "We review your submission", detail: "Our editors review all submissions within 5 school days and may reach out with questions or requests for additional information." },
              { step: "2", label: "Editing and fact-checking", detail: "Accepted pieces go through editing for clarity, accuracy, and style. We will contact you before making significant changes." },
              { step: "3", label: "Publication", detail: "Once approved, your contribution will be published on the website. For print issues, inclusion depends on available space and editorial judgment." },
            ].map((item) => (
              <li key={item.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </PageLayout>
  );
}

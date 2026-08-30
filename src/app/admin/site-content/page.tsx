"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Globe2,
  ImageIcon,
  Loader2,
  Save,
  Settings2,
} from "lucide-react";
import ImageUpload from "@/components/admin/uploads/ImageUpload";

type Tab = "hero" | "about" | "settings";

type HeroData = {
  badge: string;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  heroImage: string;
};

type AboutData = {
  sectionTitle: string;
  title: string;
  description: string;
  experience: number;
  image: string;
  featureOne: string;
  featureTwo: string;
  featureThree: string;
};

type SettingsData = {
  companyName: string;
  logo: string;
  whiteLogo: string;
  favicon: string;

  phone: string;
  email: string;
  address: string;

  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;

  salesEmail: string;
  seoEmail: string;
  aiEmail: string;
  supportEmail: string;
  mediaEmail: string;

  footerCopyright: string;
};

const emptyHero: HeroData = {
  badge: "",
  title: "",
  description: "",
  primaryButtonText: "",
  primaryButtonLink: "",
  secondaryButtonText: "",
  secondaryButtonLink: "",
  heroImage: "",
};

const emptyAbout: AboutData = {
  sectionTitle: "",
  title: "",
  description: "",
  experience: 0,
  image: "",
  featureOne: "",
  featureTwo: "",
  featureThree: "",
};

const emptySettings: SettingsData = {
  companyName: "",
  logo: "",
  whiteLogo: "",
  favicon: "",

  phone: "",
  email: "",
  address: "",

  facebook: "",
  instagram: "",
  linkedin: "",
  twitter: "",
  youtube: "",

  salesEmail: "",
  seoEmail: "",
  aiEmail: "",
  supportEmail: "",
  mediaEmail: "",

  footerCopyright: "",
};

export default function SiteContentPage() {
  const [tab, setTab] = useState<Tab>("hero");

  const [hero, setHero] = useState<HeroData>(emptyHero);
  const [about, setAbout] = useState<AboutData>(emptyAbout);
  const [settings, setSettings] = useState<SettingsData>(emptySettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      setLoading(true);
      setError("");

      const [heroResponse, aboutResponse, settingsResponse] = await Promise.all(
        [
          fetch("/api/admin/home-hero"),
          fetch("/api/admin/home-about"),
          fetch("/api/admin/site-settings"),
        ],
      );

      if (!heroResponse.ok || !aboutResponse.ok || !settingsResponse.ok) {
        throw new Error("Unable to load website content.");
      }

      const [heroData, aboutData, settingsData] = await Promise.all([
        heroResponse.json(),
        aboutResponse.json(),
        settingsResponse.json(),
      ]);
      if (heroData) {
        setHero({
          badge: heroData.badge ?? "",
          title: heroData.title ?? "",
          description: heroData.description ?? "",
          primaryButtonText: heroData.primaryButtonText ?? "",
          primaryButtonLink: heroData.primaryButtonLink ?? "",
          secondaryButtonText: heroData.secondaryButtonText ?? "",
          secondaryButtonLink: heroData.secondaryButtonLink ?? "",
          heroImage: heroData.heroImage ?? "",
        });
      }

      if (aboutData) {
        setAbout({
          sectionTitle: aboutData.sectionTitle ?? "",
          title: aboutData.title ?? "",
          description: aboutData.description ?? "",
          experience: aboutData.experience ?? 0,
          image: aboutData.image ?? "",
          featureOne: aboutData.featureOne ?? "",
          featureTwo: aboutData.featureTwo ?? "",
          featureThree: aboutData.featureThree ?? "",
        });
      }

      if (settingsData) {
        setSettings({
          companyName: settingsData.companyName ?? "",
          logo: settingsData.logo ?? "",
          whiteLogo: settingsData.whiteLogo ?? "",
          favicon: settingsData.favicon ?? "",

          phone: settingsData.phone ?? "",
          email: settingsData.email ?? "",
          address: settingsData.address ?? "",

          facebook: settingsData.facebook ?? "",
          instagram: settingsData.instagram ?? "",
          linkedin: settingsData.linkedin ?? "",
          twitter: settingsData.twitter ?? "",
          youtube: settingsData.youtube ?? "",

          salesEmail: settingsData.salesEmail ?? "",
          seoEmail: settingsData.seoEmail ?? "",
          aiEmail: settingsData.aiEmail ?? "",
          supportEmail: settingsData.supportEmail ?? "",
          mediaEmail: settingsData.mediaEmail ?? "",

          footerCopyright: settingsData.footerCopyright ?? "",
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load website content.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveCurrentSection() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let endpoint = "";
      let body: HeroData | AboutData | SettingsData;

      if (tab === "hero") {
        endpoint = "/api/admin/home-hero";
        body = hero;
      } else if (tab === "about") {
        endpoint = "/api/admin/home-about";
        body = about;
      } else {
        endpoint = "/api/admin/site-settings";
        body = settings;
      }

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to save changes.",
        );
      }

      setSuccess("Changes saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-black/30" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}

      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-lime-600">
          Website CMS
        </p>

        <h1 className="mt-2 text-3xl font-black text-black sm:text-4xl">
          Site Content
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50">
          Update homepage content and global company information without
          changing the website code.
        </p>
      </div>

      {/* Tabs */}

      <div className="mt-7 flex flex-wrap gap-2 rounded-2xl bg-white p-2 shadow-sm">
        <TabButton
          active={tab === "hero"}
          onClick={() => {
            setTab("hero");
            setSuccess("");
            setError("");
          }}
          icon={<Globe2 size={17} />}
        >
          Homepage Hero
        </TabButton>

        <TabButton
          active={tab === "about"}
          onClick={() => {
            setTab("about");
            setSuccess("");
            setError("");
          }}
          icon={<Building2 size={17} />}
        >
          Homepage About
        </TabButton>

        <TabButton
          active={tab === "settings"}
          onClick={() => {
            setTab("settings");
            setSuccess("");
            setError("");
          }}
          icon={<Settings2 size={17} />}
        >
          Site Settings
        </TabButton>
      </div>

      <div className="mt-7">
        {tab === "hero" && <HeroEditor data={hero} setData={setHero} />}

        {tab === "about" && <AboutEditor data={about} setData={setAbout} />}

        {tab === "settings" && (
          <SettingsEditor data={settings} setData={setSettings} />
        )}
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          <CheckCircle2 size={17} />
          {success}
        </div>
      )}

      <div className="sticky bottom-5 mt-7 flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={saveCurrentSection}
          className="inline-flex h-12 items-center gap-2 rounded-xl bg-black px-6 text-sm font-black text-white shadow-xl transition hover:bg-lime-400 hover:text-black disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={17} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* HERO */

function HeroEditor({
  data,
  setData,
}: {
  data: HeroData;
  setData: React.Dispatch<React.SetStateAction<HeroData>>;
}) {
  return (
    <div className="grid gap-7 xl:grid-cols-[1.15fr_0.85fr]">
      <Section title="Hero Content">
        <Field label="Badge">
          <input
            value={data.badge}
            onChange={(e) =>
              setData({
                ...data,
                badge: e.target.value,
              })
            }
            className={inputClass}
            placeholder="Digital Agency"
          />
        </Field>

        <Field label="Main Title">
          <input
            value={data.title}
            onChange={(e) =>
              setData({
                ...data,
                title: e.target.value,
              })
            }
            className={inputClass}
            placeholder="Creative Digital Agency"
          />
        </Field>

        <Field label="Description">
          <textarea
            value={data.description}
            onChange={(e) =>
              setData({
                ...data,
                description: e.target.value,
              })
            }
            className={textareaClass}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Primary button text">
            <input
              value={data.primaryButtonText}
              onChange={(e) =>
                setData({
                  ...data,
                  primaryButtonText: e.target.value,
                })
              }
              className={inputClass}
            />
          </Field>

          <Field label="Primary button link">
            <input
              value={data.primaryButtonLink}
              onChange={(e) =>
                setData({
                  ...data,
                  primaryButtonLink: e.target.value,
                })
              }
              className={inputClass}
            />
          </Field>

          <Field label="Secondary button text">
            <input
              value={data.secondaryButtonText}
              onChange={(e) =>
                setData({
                  ...data,
                  secondaryButtonText: e.target.value,
                })
              }
              className={inputClass}
            />
          </Field>

          <Field label="Secondary button link">
            <input
              value={data.secondaryButtonLink}
              onChange={(e) =>
                setData({
                  ...data,
                  secondaryButtonLink: e.target.value,
                })
              }
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="Hero Image">
        <ImageUpload
          label="Hero Image"
          value={data.heroImage}
          onChange={(url) =>
            setData((current) => ({
              ...current,
              heroImage: url,
            }))
          }
        />
      </Section>
    </div>
  );
}

/* ABOUT */

function AboutEditor({
  data,
  setData,
}: {
  data: AboutData;
  setData: React.Dispatch<React.SetStateAction<AboutData>>;
}) {
  return (
    <div className="grid gap-7 xl:grid-cols-[1.15fr_0.85fr]">
      <Section title="About Content">
        <Field label="Section title">
          <input
            value={data.sectionTitle}
            onChange={(e) =>
              setData({
                ...data,
                sectionTitle: e.target.value,
              })
            }
            className={inputClass}
          />
        </Field>

        <Field label="Heading">
          <input
            value={data.title}
            onChange={(e) =>
              setData({
                ...data,
                title: e.target.value,
              })
            }
            className={inputClass}
          />
        </Field>

        <Field label="Description">
          <textarea
            value={data.description}
            onChange={(e) =>
              setData({
                ...data,
                description: e.target.value,
              })
            }
            className={textareaClass}
          />
        </Field>

        <Field label="Years of experience">
          <input
            type="number"
            min={0}
            value={data.experience}
            onChange={(e) =>
              setData({
                ...data,
                experience: Number(e.target.value),
              })
            }
            className={inputClass}
          />
        </Field>
      </Section>

      <div className="space-y-7">
        <Section title="About Image">
          <ImageUpload
            label="About Image"
            value={data.image}
            onChange={(url) =>
              setData((current) => ({
                ...current,
                image: url,
              }))
            }
          />
        </Section>

        <Section title="Highlights">
          <Field label="Feature one">
            <input
              value={data.featureOne}
              onChange={(e) =>
                setData({
                  ...data,
                  featureOne: e.target.value,
                })
              }
              className={inputClass}
            />
          </Field>

          <Field label="Feature two">
            <input
              value={data.featureTwo}
              onChange={(e) =>
                setData({
                  ...data,
                  featureTwo: e.target.value,
                })
              }
              className={inputClass}
            />
          </Field>

          <Field label="Feature three">
            <input
              value={data.featureThree}
              onChange={(e) =>
                setData({
                  ...data,
                  featureThree: e.target.value,
                })
              }
              className={inputClass}
            />
          </Field>
        </Section>
      </div>
    </div>
  );
}

/* SETTINGS */

function SettingsEditor({
  data,
  setData,
}: {
  data: SettingsData;
  setData: React.Dispatch<React.SetStateAction<SettingsData>>;
}) {
  function update(key: keyof SettingsData, value: string) {
    setData((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <div className="grid gap-7 xl:grid-cols-2">
      <Section title="Company Information">
        <Field label="Company name">
          <input
            value={data.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Phone">
          <input
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Main email">
          <input
            type="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Address">
          <textarea
            value={data.address}
            onChange={(e) => update("address", e.target.value)}
            className={textareaClass}
          />
        </Field>
      </Section>

      <Section title="Brand Assets">
        <ImageUpload
          label="Main Logo"
          value={data.logo}
          onChange={(url) => update("logo", url)}
        />

        <ImageUpload
          label="White Logo"
          value={data.whiteLogo}
          onChange={(url) => update("whiteLogo", url)}
        />

        <ImageUpload
          label="Favicon"
          value={data.favicon}
          onChange={(url) => update("favicon", url)}
        />
      </Section>

      <Section title="Department Emails">
        <EmailField
          label="Sales"
          value={data.salesEmail}
          onChange={(value) => update("salesEmail", value)}
        />

        <EmailField
          label="SEO"
          value={data.seoEmail}
          onChange={(value) => update("seoEmail", value)}
        />

        <EmailField
          label="AI"
          value={data.aiEmail}
          onChange={(value) => update("aiEmail", value)}
        />

        <EmailField
          label="Support"
          value={data.supportEmail}
          onChange={(value) => update("supportEmail", value)}
        />

        <EmailField
          label="Media"
          value={data.mediaEmail}
          onChange={(value) => update("mediaEmail", value)}
        />
      </Section>

      <Section title="Social Links">
        {(
          ["facebook", "instagram", "linkedin", "twitter", "youtube"] as const
        ).map((network) => (
          <Field
            key={network}
            label={network.charAt(0).toUpperCase() + network.slice(1)}
          >
            <input
              value={data[network]}
              onChange={(e) => update(network, e.target.value)}
              className={inputClass}
              placeholder={`https://${network}.com/...`}
            />
          </Field>
        ))}

        <Field label="Footer copyright">
          <input
            value={data.footerCopyright}
            onChange={(e) => update("footerCopyright", e.target.value)}
            className={inputClass}
          />
        </Field>
      </Section>
    </div>
  );
}

/* SHARED COMPONENTS */

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
        active
          ? "bg-black text-white"
          : "text-black/50 hover:bg-black/5 hover:text-black"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-black/5 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-black text-black">{title}</h2>

      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#1b1b23]">
        {label}
      </label>

      {children}
    </div>
  );
}

function EmailField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={`${label} email`}>
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </Field>
  );
}

function ImagePreview({ src, label }: { src: string; label: string }) {
  if (!src) {
    return (
      <div className="flex h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 bg-[#fafaf7]">
        <ImageIcon className="h-8 w-8 text-black/15" />

        <p className="mt-3 text-sm font-semibold text-black/30">
          No image selected
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-black/5">
      <img src={src} alt={label} className="h-60 w-full object-cover" />
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-black/10 bg-[#fafaf7] px-4 text-sm text-[#1b1b23] outline-none transition placeholder:text-black/30 focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10";

const textareaClass =
  "min-h-[150px] w-full resize-y rounded-xl border border-black/10 bg-[#fafaf7] px-4 py-3 text-sm leading-7 text-[#1b1b23] outline-none transition placeholder:text-black/30 focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10";

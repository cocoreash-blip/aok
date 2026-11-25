import { useState, useEffect, useRef, useCallback } from "react";
import { useContent } from "./ContentContext.jsx";
import { supabase } from "./supabaseClient.js";

function shallowMerge(oldObj, updates) {
  return { ...oldObj, ...updates };
}

function deepUpdate(prev, path, value) {
  const keys = path.split(".");
  const newObj = Array.isArray(prev) ? [...prev] : { ...prev };
  let cur = newObj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    cur[k] = Array.isArray(cur[k]) ? [...cur[k]] : { ...cur[k] };
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  return newObj;
}

function ImageUploader({ label, value, onChange, bucket = "site-assets" }) {
  const [uploading, setUploading] = useState(false);
  const [removingBg, setRemovingBg] = useState(false);
  const [bgError, setBgError] = useState(null);
  const lastFileRef = useRef(null);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setBgError(null);
    lastFileRef.current = file;
    const ext = file.name.split(".").pop();
    const fileName = `${label.replace(/\s+/g, "_").toLowerCase()}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.error("Upload error:", error);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    onChange(urlData.publicUrl);
    setUploading(false);
  };

  const handleRemoveBackground = async () => {
    if (!lastFileRef.current && !value) return;

    setRemovingBg(true);
    setBgError(null);

    try {
      let imageSource;
      if (lastFileRef.current) {
        imageSource = lastFileRef.current;
      } else {
        const response = await fetch(value);
        const blob = await response.blob();
        imageSource = blob;
      }

      const { removeBackground } = await import("@imgly/background-removal");
      const resultBlob = await removeBackground(imageSource, {
        output: { format: "image/png" },
      });

      const pngFile = new File(
        [resultBlob],
        `${label.replace(/\s+/g, "_").toLowerCase()}_transparent_${Date.now()}.png`,
        { type: "image/png" }
      );

      lastFileRef.current = pngFile;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(pngFile.name, pngFile, { upsert: true });

      if (error) {
        console.error("Upload error:", error);
        setBgError("Failed to save processed image.");
        setRemovingBg(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(pngFile.name);

      onChange(urlData.publicUrl);
    } catch (err) {
      console.error("Background removal error:", err);
      setBgError("Could not remove background. Try a different image.");
    }

    setRemovingBg(false);
  };

  return (
    <div>
      <label className="block text-sm font-body text-gray-300 mb-2">{label}</label>
      <div className="flex items-center gap-4">
        {value && (
          <img
            src={value}
            alt={label}
            className="w-20 h-20 object-contain rounded border border-white/10 bg-[#0f1113] bg-[linear-gradient(45deg,#1a1d21_25%,transparent_25%,transparent_75%,#1a1d21_75%,#1a1d21),linear-gradient(45deg,#1a1d21_25%,transparent_25%,transparent_75%,#1a1d21_75%,#1a1d21)] bg-[length:12px_12px] bg-[position:0_0,6px_6px]"
          />
        )}
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading || removingBg}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={removingBg}
              className="px-4 py-2 bg-red-600/20 text-red-400 text-sm rounded hover:bg-red-600/30 transition-colors disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {value && !uploading && (
        <button
          type="button"
          onClick={handleRemoveBackground}
          disabled={removingBg}
          className="mt-3 px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-500 transition-colors disabled:opacity-50"
        >
          {removingBg ? "Removing background..." : "Remove Background"}
        </button>
      )}

      {removingBg && (
        <p className="mt-2 text-xs text-gray-500">
          Processing in your browser — this can take a few seconds for large images.
        </p>
      )}

      {bgError && (
        <p className="mt-2 text-xs text-red-400">{bgError}</p>
      )}

      {value && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full mt-2 px-3 py-2 bg-black/30 border border-white/10 rounded text-gray-300 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      )}
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, multiline }) {
  if (multiline) {
    return (
      <div>
        <label className="block text-sm font-body text-gray-300 mb-2">{label}</label>
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-body resize-none"
        />
      </div>
    );
  }
  return (
    <div>
      <label className="block text-sm font-body text-gray-300 mb-2">{label}</label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-body"
      />
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-body text-gray-300 mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded border border-white/10 bg-transparent cursor-pointer"
        />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-lg bg-white/[0.02] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
      >
        <span className="font-heading font-600 text-white uppercase tracking-wide text-sm">
          {title}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-2 space-y-4">{children}</div>
      )}
    </div>
  );
}

function AdminPanel({ onExit }) {
  const { content, setContent, updateContent } = useContent();
  const [saveStatus, setSaveStatus] = useState("idle");
  const saveTimer = useRef(null);

  const update = useCallback(
    (path, value) => {
      setContent((prev) => deepUpdate(prev, path, value));
      setSaveStatus("saving");
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        const newData = deepUpdate(content, path, value);
        const ok = await updateContent(newData);
        setSaveStatus(ok ? "saved" : "error");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }, 800);
    },
    [content, setContent, updateContent]
  );

  const updateDirect = useCallback(
    (newContent) => {
      setContent(newContent);
      setSaveStatus("saving");
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        const ok = await updateContent(newContent);
        setSaveStatus(ok ? "saved" : "error");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }, 800);
    },
    [setContent, updateContent]
  );

  const c = content;

  return (
    <div className="min-h-screen bg-[#0a0b0d] font-body">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-[#111315] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-heading font-700 text-white text-xl uppercase tracking-wide">
            Admin Panel
          </h1>
          <span
            className={`text-xs px-3 py-1 rounded-full font-body ${
              saveStatus === "saving"
                ? "bg-yellow-500/20 text-yellow-400"
                : saveStatus === "saved"
                ? "bg-green-500/20 text-green-400"
                : saveStatus === "error"
                ? "bg-red-500/20 text-red-400"
                : "bg-white/5 text-gray-400"
            }`}
          >
            {saveStatus === "saving"
              ? "Saving..."
              : saveStatus === "saved"
              ? "Saved"
              : saveStatus === "error"
              ? "Save failed"
              : "All changes saved"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onExit();
            }}
            className="px-5 py-2 bg-white/10 text-white text-sm rounded hover:bg-white/20 transition-colors font-body"
          >
            View Live Site
          </a>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="px-5 py-2 bg-white/5 text-gray-300 text-sm rounded hover:bg-white/10 transition-colors font-body"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-4">
        {/* Brand & Logo */}
        <Section title="Brand & Logo" defaultOpen>
          <TextField
            label="Brand Name (First Part)"
            value={c.brand?.name}
            onChange={(v) => update("brand.name", v)}
          />
          <TextField
            label="Brand Name (Second Part)"
            value={c.brand?.nameSecond}
            onChange={(v) => update("brand.nameSecond", v)}
          />
          <ImageUploader
            label="Logo (uploads and replaces text)"
            value={c.brand?.logoUrl}
            onChange={(v) => update("brand.logoUrl", v)}
          />
          {c.brand?.logoUrl && (
            <p className="text-xs text-gray-500">
              When a logo is uploaded, it replaces the text brand name in the
              navbar and footer.
            </p>
          )}
        </Section>

        {/* Colors */}
        <Section title="Website Colors" defaultOpen>
          <ColorField
            label="Primary Color (buttons, accents, highlights)"
            value={c.colors?.primary}
            onChange={(v) => update("colors.primary", v)}
          />
          <ColorField
            label="Primary Hover Color"
            value={c.colors?.primaryHover}
            onChange={(v) => update("colors.primaryHover", v)}
          />
          <ColorField
            label="Secondary Color"
            value={c.colors?.secondary}
            onChange={(v) => update("colors.secondary", v)}
          />
          <ColorField
            label="Accent Color"
            value={c.colors?.accent}
            onChange={(v) => update("colors.accent", v)}
          />
        </Section>

        {/* Hero */}
        <Section title="Hero Section">
          <ImageUploader
            label="Hero Background Image"
            value={c.hero?.image}
            onChange={(v) => update("hero.image", v)}
          />
          <TextField
            label="Eyebrow Text (small label above title)"
            value={c.hero?.eyebrow}
            onChange={(v) => update("hero.eyebrow", v)}
          />
          <TextField
            label="Title Line 1"
            value={c.hero?.titleLine1}
            onChange={(v) => update("hero.titleLine1", v)}
          />
          <TextField
            label="Title Line 2 (accent color)"
            value={c.hero?.titleLine2}
            onChange={(v) => update("hero.titleLine2", v)}
          />
          <TextField
            label="Description"
            value={c.hero?.description}
            onChange={(v) => update("hero.description", v)}
            multiline
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Primary Button Text"
              value={c.hero?.button1Text}
              onChange={(v) => update("hero.button1Text", v)}
            />
            <TextField
              label="Secondary Button Text"
              value={c.hero?.button2Text}
              onChange={(v) => update("hero.button2Text", v)}
            />
          </div>
          <div>
            <label className="block text-sm font-body text-gray-300 mb-2">
              Stats
            </label>
            {c.hero?.stats?.map((stat, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) =>
                    update(`hero.stats.${i}.value`, e.target.value)
                  }
                  placeholder="Value"
                  className="w-24 px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) =>
                    update(`hero.stats.${i}.label`, e.target.value)
                  }
                  placeholder="Label"
                  className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </Section>

        {/* About */}
        <Section title="About Section">
          <ImageUploader
            label="About Image"
            value={c.about?.image}
            onChange={(v) => update("about.image", v)}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Badge Text"
              value={c.about?.badge}
              onChange={(v) => update("about.badge", v)}
            />
            <TextField
              label="Badge Label"
              value={c.about?.badgeLabel}
              onChange={(v) => update("about.badgeLabel", v)}
            />
          </div>
          <TextField
            label="Eyebrow Text"
            value={c.about?.eyebrow}
            onChange={(v) => update("about.eyebrow", v)}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Title (main)"
              value={c.about?.title}
              onChange={(v) => update("about.title", v)}
            />
            <TextField
              label="Title (accent color)"
              value={c.about?.titleAccent}
              onChange={(v) => update("about.titleAccent", v)}
            />
          </div>
          <TextField
            label="Paragraph 1"
            value={c.about?.paragraph1}
            onChange={(v) => update("about.paragraph1", v)}
            multiline
          />
          <TextField
            label="Paragraph 2"
            value={c.about?.paragraph2}
            onChange={(v) => update("about.paragraph2", v)}
            multiline
          />
          <TextField
            label="Tags (comma separated)"
            value={c.about?.tags?.join(", ")}
            onChange={(v) =>
              update(
                "about.tags",
                v.split(",").map((t) => t.trim()).filter(Boolean)
              )
            }
          />
          <div>
            <label className="block text-sm font-body text-gray-300 mb-2">
              Service Cards
            </label>
            {c.about?.cards?.map((card, i) => (
              <div
                key={i}
                className="p-4 bg-black/20 border border-white/10 rounded space-y-2 mb-3"
              >
                <input
                  type="text"
                  value={card.name}
                  onChange={(e) =>
                    update(`about.cards.${i}.name`, e.target.value)
                  }
                  placeholder="Card Name"
                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <textarea
                  value={card.desc}
                  onChange={(e) =>
                    update(`about.cards.${i}.desc`, e.target.value)
                  }
                  placeholder="Description"
                  rows={2}
                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Products */}
        <Section title="Products Section">
          <TextField
            label="Eyebrow Text"
            value={c.products?.eyebrow}
            onChange={(v) => update("products.eyebrow", v)}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Title (main)"
              value={c.products?.title}
              onChange={(v) => update("products.title", v)}
            />
            <TextField
              label="Title (accent color)"
              value={c.products?.titleAccent}
              onChange={(v) => update("products.titleAccent", v)}
            />
          </div>
          <TextField
            label="Description"
            value={c.products?.description}
            onChange={(v) => update("products.description", v)}
            multiline
          />
          <div>
            <label className="block text-sm font-body text-gray-300 mb-2">
              Product Items
            </label>
            {c.products?.items?.map((item, i) => (
              <div
                key={i}
                className="p-4 bg-black/20 border border-white/10 rounded space-y-3 mb-3"
              >
                <ImageUploader
                  label={`Product ${i + 1} Image`}
                  value={item.image}
                  onChange={(v) => update(`products.items.${i}.image`, v)}
                />
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    update(`products.items.${i}.name`, e.target.value)
                  }
                  placeholder="Product Name"
                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <textarea
                  value={item.desc}
                  onChange={(e) =>
                    update(`products.items.${i}.desc`, e.target.value)
                  }
                  placeholder="Description"
                  rows={2}
                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Specifications */}
        <Section title="Technical Specifications">
          <TextField
            label="Eyebrow Text"
            value={c.specs?.eyebrow}
            onChange={(v) => update("specs.eyebrow", v)}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Title (main)"
              value={c.specs?.title}
              onChange={(v) => update("specs.title", v)}
            />
            <TextField
              label="Title (accent color)"
              value={c.specs?.titleAccent}
              onChange={(v) => update("specs.titleAccent", v)}
            />
          </div>
          <TextField
            label="Description"
            value={c.specs?.description}
            onChange={(v) => update("specs.description", v)}
            multiline
          />
          <div>
            <label className="block text-sm font-body text-gray-300 mb-2">
              Size Guide
            </label>
            {c.specs?.sizes?.map((s, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={s.size}
                  onChange={(e) =>
                    update(`specs.sizes.${i}.size`, e.target.value)
                  }
                  placeholder="Size (e.g. 8mm)"
                  className="w-24 px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={s.use}
                  onChange={(e) =>
                    update(`specs.sizes.${i}.use`, e.target.value)
                  }
                  placeholder="Typical use / application"
                  className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-body text-gray-300 mb-2">
              Chemical Composition
            </label>
            {c.specs?.chemical?.map((row, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={row.property}
                  onChange={(e) =>
                    update(`specs.chemical.${i}.property`, e.target.value)
                  }
                  placeholder="Property"
                  className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={row.value}
                  onChange={(e) =>
                    update(`specs.chemical.${i}.value`, e.target.value)
                  }
                  placeholder="Value"
                  className="w-40 px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-body text-gray-300 mb-2">
              Mechanical Properties
            </label>
            {c.specs?.mechanical?.map((row, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={row.property}
                  onChange={(e) =>
                    update(`specs.mechanical.${i}.property`, e.target.value)
                  }
                  placeholder="Property"
                  className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={row.value}
                  onChange={(e) =>
                    update(`specs.mechanical.${i}.value`, e.target.value)
                  }
                  placeholder="Value"
                  className="w-40 px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Testimonials */}
        <Section title="Testimonials / Reviews">
          <TextField
            label="Eyebrow Text"
            value={c.testimonials?.eyebrow}
            onChange={(v) => update("testimonials.eyebrow", v)}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Title (main)"
              value={c.testimonials?.title}
              onChange={(v) => update("testimonials.title", v)}
            />
            <TextField
              label="Title (accent color)"
              value={c.testimonials?.titleAccent}
              onChange={(v) => update("testimonials.titleAccent", v)}
            />
          </div>
          <div>
            <label className="block text-sm font-body text-gray-300 mb-2">
              Reviews
            </label>
            {c.testimonials?.items?.map((item, i) => (
              <div
                key={i}
                className="p-4 bg-black/20 border border-white/10 rounded space-y-2 mb-3"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      update(`testimonials.items.${i}.name`, e.target.value)
                    }
                    placeholder="Customer Name"
                    className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={item.rating}
                    onChange={(e) =>
                      update(
                        `testimonials.items.${i}.rating`,
                        parseInt(e.target.value) || 5
                      )
                    }
                    placeholder="Rating"
                    className="w-20 px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  value={item.location}
                  onChange={(e) =>
                    update(
                      `testimonials.items.${i}.location`,
                      e.target.value
                    )
                  }
                  placeholder="Location"
                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <textarea
                  value={item.text}
                  onChange={(e) =>
                    update(`testimonials.items.${i}.text`, e.target.value)
                  }
                  placeholder="Review text"
                  rows={3}
                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Clients */}
        <Section title="Clients / Trusted By">
          <TextField
            label="Eyebrow Text"
            value={c.clients?.eyebrow}
            onChange={(v) => update("clients.eyebrow", v)}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Title (main)"
              value={c.clients?.title}
              onChange={(v) => update("clients.title", v)}
            />
            <TextField
              label="Title (accent color)"
              value={c.clients?.titleAccent}
              onChange={(v) => update("clients.titleAccent", v)}
            />
          </div>
          <TextField
            label="Description"
            value={c.clients?.description}
            onChange={(v) => update("clients.description", v)}
            multiline
          />
          <div>
            <label className="block text-sm font-body text-gray-300 mb-2">
              Client Logos (upload logos to show in this section)
            </label>
            {c.clients?.logos?.map((logo, i) => (
              <div key={i} className="mb-3">
                <ImageUploader
                  label={`Client Logo ${i + 1}`}
                  value={logo}
                  onChange={(v) => update(`clients.logos.${i}`, v)}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                update("clients.logos", [
                  ...(c.clients?.logos || []),
                  "",
                ])
              }
              className="px-4 py-2 bg-white/10 text-white text-sm rounded hover:bg-white/20 transition-colors"
            >
              + Add Client Logo
            </button>
          </div>
        </Section>

        {/* WhatsApp */}
        <Section title="WhatsApp Chat Button">
          <p className="text-xs text-gray-500 mb-4">
            Add your WhatsApp number to show a floating chat button on your
            website. Use international format without + (e.g. 2348012345678).
          </p>
          <TextField
            label="WhatsApp Phone Number"
            value={c.whatsapp?.phoneNumber}
            onChange={(v) => update("whatsapp.phoneNumber", v)}
          />
          <TextField
            label="Default Message"
            value={c.whatsapp?.message}
            onChange={(v) => update("whatsapp.message", v)}
            multiline
          />
        </Section>

        {/* Contact */}
        <Section title="Contact Section">
          <TextField
            label="Eyebrow Text"
            value={c.contact?.eyebrow}
            onChange={(v) => update("contact.eyebrow", v)}
          />
          <TextField
            label="Title"
            value={c.contact?.title}
            onChange={(v) => update("contact.title", v)}
          />
          <TextField
            label="Description"
            value={c.contact?.description}
            onChange={(v) => update("contact.description", v)}
            multiline
          />
          <TextField
            label="Phone Number"
            value={c.contact?.phone}
            onChange={(v) => update("contact.phone", v)}
          />
          <TextField
            label="Email Address"
            value={c.contact?.email}
            onChange={(v) => update("contact.email", v)}
          />
          <TextField
            label="Address"
            value={c.contact?.address}
            onChange={(v) => update("contact.address", v)}
          />
          <TextField
            label="Business Hours"
            value={c.contact?.hours}
            onChange={(v) => update("contact.hours", v)}
          />
          <TextField
            label="Submit Button Text"
            value={c.contact?.buttonText}
            onChange={(v) => update("contact.buttonText", v)}
          />
          <ColorField
            label="Contact Section Background Color"
            value={c.contact?.backgroundColor}
            onChange={(v) => update("contact.backgroundColor", v)}
          />
        </Section>

        {/* Form Notifications */}
        <Section title="Form Notifications" defaultOpen>
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded space-y-3">
            <p className="text-sm text-blue-300 font-body">
              Contact form submissions are emailed to this address. Use any
              Gmail or other email account. Leave blank to use the fallback
              address set on the server.
            </p>
            <TextField
              label="Email address for form submissions"
              value={c.contact?.receiveEmail}
              onChange={(v) => update("contact.receiveEmail", v)}
              placeholder="you@gmail.com"
            />
          </div>
        </Section>

        {/* Footer */}
        <Section title="Footer">
          <TextField
            label="Description"
            value={c.footer?.description}
            onChange={(v) => update("footer.description", v)}
            multiline
          />
          <TextField
            label="Copyright Text"
            value={c.footer?.copyright}
            onChange={(v) => update("footer.copyright", v)}
          />
        </Section>

        <div className="h-20" />
      </div>
    </div>
  );
}

export default AdminPanel;

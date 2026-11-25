import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, DEFAULT_CONTENT } from "./supabaseClient.js";

function deepMerge(base, override) {
  if (Array.isArray(base) || typeof base !== "object" || base === null) {
    return override !== undefined ? override : base;
  }
  if (Array.isArray(override) || typeof override !== "object" || override === null) {
    return override !== undefined ? override : base;
  }
  const result = { ...base };
  for (const key of Object.keys(override)) {
    result[key] = key in base ? deepMerge(base[key], override[key]) : override[key];
  }
  return result;
}

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  const loadContent = useCallback(async () => {
    const { data, error } = await supabase
      .from("site_content")
      .select("data")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("Failed to load site content:", error);
    } else if (data?.data) {
      setContent(deepMerge(DEFAULT_CONTENT, data.data));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadContent();

    const channel = supabase
      .channel("site_content_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content" },
        (payload) => {
          if (payload.new?.data) {
            setContent(deepMerge(DEFAULT_CONTENT, payload.new.data));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadContent]);

  const updateContent = useCallback(async (newData) => {
    const { error } = await supabase
      .from("site_content")
      .upsert({ id: 1, data: newData });

    if (error) {
      console.error("Failed to save content:", error);
      return false;
    }
    return true;
  }, []);

  return (
    <ContentContext.Provider value={{ content, setContent, updateContent, loading }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}

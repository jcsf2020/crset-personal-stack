"use client";
import CookieConsent from "react-cookie-consent";

export default function CookieConsentBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Aceitar"
      declineButtonText="Recusar"
      cookieName="crset_cookie_consent"
      style={{ background: "#2B373B", fontSize: "14px" }}
      buttonStyle={{ color: "#fff", background: "#0070f3", fontSize: "13px", borderRadius: "6px", padding: "6px 16px" }}
      declineButtonStyle={{ color: "#fff", background: "#ff0000", fontSize: "13px", borderRadius: "6px", padding: "6px 16px", marginLeft: "10px" }}
      enableDeclineButton
      flipButtons
    >
      Usamos cookies para melhorar a experiência, analisar tráfego e personalizar conteúdos.{" "}
      <a href="/privacidade" style={{ color: "#fff", textDecoration: "underline" }}>
        Política de Privacidade
      </a>
    </CookieConsent>
  );
}

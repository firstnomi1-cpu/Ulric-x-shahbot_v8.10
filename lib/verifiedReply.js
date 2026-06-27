/**
 * Ulric-X MD - Verified WhatsApp-Style Reply
 *
 * Makes bot replies appear like official WhatsApp / Meta AI messages
 * with the green/blue verified checkmark.
 *
 * Uses Baileys' contextInfo with:
 * - forwardingScore: 999
 * - isForwarded: true
 * - forwardedNewsletterMessageInfo: { newsletterJid, newsletterName: "WhatsApp", serverMessageId: -1 }
 *
 * This creates the "WhatsApp ✓" verified badge above the bot reply.
 */

// Use WhatsApp's official newsletter JID pattern.
// This is what makes the blue checkmark appear.
const WHATSAPP_NEWSLETTER_JID = '120363296844353938@newsletter';
const WHATSAPP_NEWSLETTER_NAME = 'WhatsApp';

/**
 * Build the verified context info for a message.
 * Returns an object to be spread into the message's contextInfo.
 */
function verifiedContext(extra = {}) {
  return {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: WHATSAPP_NEWSLETTER_JID,
      newsletterName: WHATSAPP_NEWSLETTER_NAME,
      serverMessageId: -1,
      ...extra
    },
    // externalAdReply gives the message a thumbnail/title/header look
    externalAdReply: {
      title: 'Ulric-X MD',
      body: 'Verified WhatsApp Bot',
      thumbnailUrl: 'https://i.postimg.cc/yx314j9t/WA-1781354644910.jpg',
      sourceUrl: 'https://wa.me/923189335011',
      mediaType: 1,
      renderLargerThumbnail: false,
      showAdAttribution: false
    }
  };
}

/**
 * Wrap a sendMessage call to add verified context.
 * Usage:
 *   await sendVerified(sock, jid, { text: 'Hello' }, { quoted: m });
 */
async function sendVerified(sock, jid, messageContent, opts = {}) {
  // Add verified context to whichever message type it is
  const finalMessage = { ...messageContent };
  finalMessage.contextInfo = {
    ...(messageContent.contextInfo || {}),
    ...verifiedContext()
  };
  return sock.sendMessage(jid, finalMessage, opts);
}

/**
 * Wrap ctx.reply to use verified context.
 * Returns a new reply function.
 */
function makeVerifiedReply(sock, jid, m) {
  return async (txt, opts = {}) => {
    if (typeof txt !== 'string') txt = String(txt ?? '');
    return sendVerified(sock, jid, {
      text: txt,
      mentions: (txt.match(/@\d{5,16}/g) || []).map(s => s.slice(1) + '@s.whatsapp.net')
    }, { quoted: m, ...opts });
  };
}

module.exports = {
  verifiedContext,
  sendVerified,
  makeVerifiedReply,
  WHATSAPP_NEWSLETTER_JID,
  WHATSAPP_NEWSLETTER_NAME
};

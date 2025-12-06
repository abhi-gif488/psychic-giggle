export async function initQuote() {
  const quoteDisplay = document.getElementById('quote-display');
  if (!quoteDisplay) {
    console.error('initQuote: #quote-display element not found');
    return;
  }

  // helper: safe HTML escape
  function escapeHtml(str = '') {
    return String(str).replace(/[&<>"']/g, (m) => (
      {'&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;',
        "'":"&#39;"}
        [m]));
  }

  // helper: fetch with timeout
  async function fetchWithTimeout(url, opts = {}, timeout = 7000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, {...opts, signal: controller.signal});
      clearTimeout(id);
      return res;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  // Local fallback quotes (used if network fails)
  const fallbackQuotes = [
    { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { content: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
    { content: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" }
  ];

  // render UI
  function renderQuote(quoteText, authorText) {
    quoteDisplay.innerHTML = `
      <blockquote class="quote-block">"${escapeHtml(quoteText)}"</blockquote>
      <cite class="quote-author">— ${escapeHtml(authorText || 'Unknown')}</cite>
      <div class="quote-actions">
        <button id="new-quote" type="button">New Quote</button>
      </div>
    `;
    // bind button
    const btn = document.getElementById('new-quote');
    if (btn) {
      btn.onclick = () => fetchQuote();
    }
  }

  // render loading
  function renderLoading() {
    quoteDisplay.innerHTML = `<div class="spinner"><i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Loading...</div>`;
  }

  // render error + fallback button
  function renderError(message) {
    quoteDisplay.innerHTML = `
      <p class="quote-error">Error loading quote. <button id="retry-quote" type="button">Retry</button></p>
      <p class="quote-debug" style="display:none">${escapeHtml(message)}</p>
    `;
    const retry = document.getElementById('retry-quote');
    if (retry) retry.onclick = () => fetchQuote();
  }

  // the main fetch logic
  async function fetchQuote() {
    renderLoading();

    const urls = [
      { url: 'https://api.quotable.io/random', type: 'quotable' },
      // another public fallback
      { url: 'https://dummyjson.com/quotes/random', type: 'dummyjson' },];

    let lastErr = null;

    for (const candidate of urls) {
      try {
        const res = await fetchWithTimeout(candidate.url, {}, 7000);
        if (!res.ok) {
          lastErr = new Error(`HTTP ${res.status} from ${candidate.url}`);
          console.warn('Quote fetch not ok:', lastErr);
          continue; // try next candidate
        }

        const data = await res.json();

        // map API to fields
        let quoteText = data.content ?? data.quote ?? data.text ?? null;
        let authorText = data.author ?? data.authorName ?? data.character ?? null;

        if (!quoteText) {
          lastErr = new Error('No quote text in response from ' + candidate.url);
          console.warn(lastErr);
          continue;
        }

        // success
        renderQuote(quoteText, authorText);
        return;
      } catch (err) {
        lastErr = err;
        console.warn('Quote fetch error for', candidate.url, err);
        // try next candidate
      }
    }

    // if we reach here, network sources failed — use local fallback
    console.warn('All quote APIs failed. Using local fallback. Last error:', lastErr);
    const fallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    renderQuote(fallback.content, fallback.author);
    // also show a retry button and an optional error 
  }

  // initial load
  fetchQuote().catch(err => {
    console.error('Unexpected initQuote error:', err);
    renderError(String(err));
  });
}

/**
 * Modul Integrasi Google Sheets & Google Apps Script
 * Sistem Pendataan Guru SD Salatiga 03
 */

const SheetsAPI = {
  // Config state
  config: {
    spreadsheetId: '1F9Tbfuny5QnSbE-YRH1Iu9huf_ACEzn1jaqSjbVsYzk',
    webAppUrl: '',
    isConnected: false,
    lastSync: null
  },

  init(webAppUrl) {
    if (webAppUrl) {
      this.config.webAppUrl = webAppUrl.trim();
    }
    const saved = localStorage.getItem('gurudata_sheets_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.config = { ...this.config, ...parsed };
      } catch (e) {}
    }
  },

  saveConfig(webAppUrl) {
    this.config.webAppUrl = webAppUrl.trim();
    localStorage.setItem('gurudata_sheets_config', JSON.stringify({
      spreadsheetId: this.config.spreadsheetId,
      webAppUrl: this.config.webAppUrl
    }));
  },

  async testConnection() {
    if (!this.config.webAppUrl) {
      return { ok: false, error: 'URL Web App Apps Script belum dikonfigurasi.' };
    }
    try {
      const url = `${this.config.webAppUrl}?action=health`;
      const res = await fetch(url, { method: 'GET', mode: 'cors' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.ok) {
        this.config.isConnected = true;
        this.config.lastSync = new Date().toISOString();
        return { ok: true, message: json.message || 'Koneksi ke Google Apps Script berhasil!' };
      }
      return { ok: false, error: json.error || 'Respon Apps Script tidak valid.' };
    } catch (e) {
      // Fallback test via no-cors or JSONP if CORS is restricted
      return {
        ok: false,
        error: `Gagal menghubungi Google Apps Script: ${e.message}. Pastikan Web App di-deploy dengan opsi "Who has access: Anyone".`
      };
    }
  },

  async fetchAllTeachers() {
    if (!this.config.webAppUrl) return null;
    try {
      const url = `${this.config.webAppUrl}?action=list`;
      const res = await fetch(url, { method: 'GET', mode: 'cors' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.ok && Array.isArray(json.data)) {
        this.config.isConnected = true;
        return json.data;
      }
      return null;
    } catch (e) {
      console.warn('SheetsAPI.fetchAllTeachers failed, falling back to local:', e);
      return null;
    }
  },

  async syncFullData(teachers, columns) {
    if (!this.config.webAppUrl) {
      return { ok: false, localOnly: true, message: 'Data tersimpan di penyimpanan lokal sekolah (URL Google Sheets belum diatur).' };
    }
    try {
      const cols = columns || (window.state ? window.state.columns : []);
      const res = await fetch(this.config.webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'sync',
          data: teachers,
          columns: cols
        })
      });
      const json = await res.json();
      if (json.ok) {
        this.config.isConnected = true;
        this.config.lastSync = new Date().toISOString();
        return { ok: true, message: json.message || 'Sinkronisasi dengan Google Sheets berhasil!' };
      }
      return { ok: false, error: json.error };
    } catch (e) {
      console.warn('Sync to Google Sheets failed:', e);
      return { ok: false, error: e.message, fallbackLocal: true };
    }
  }
};

window.SheetsAPI = SheetsAPI;
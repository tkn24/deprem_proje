
const cds = require('@sap/cds');
const axios = require('axios');
module.exports = cds.service.impl(async function() {
    this.on('READ', 'SonDepremler', async (req) => {
        try {
            const now = new Date();
            const yyyy = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');

            //test sabit tarih
            //https://servisnet.afad.gov.tr/apigateway/deprem/apiv2/event/filter?start=2025-05-13T00:00:00&end=2025-05-13T23:59:59
           
            const url = `https://servisnet.afad.gov.tr/apigateway/deprem/apiv2/event/filter?start=${yyyy}-${mm}-${dd}T00:00:00&end=${yyyy}-${mm}-${dd}T23:59:59&orderby=timedesc`;
            
            console.log('AFAD API URL:', url);
            const response = await axios.get(url, {
                headers: { 
                    'User-Agent': 'SAPApp/1.0',
                    'Accept': 'application/json'
                }
            });
            console.log('AFAD API Response:', response.data);
            return response.data.map(item => ({
                ID: item.eventID || Math.random().toString(36).substr(2, 9),
                location: item.location || 'Bilinmeyen',
                magnitude: parseFloat(item.magnitude) || 0.0,
                depth: parseFloat(item.depth) || 0.0,
                date: item.date || new Date().toISOString(),
                latitude: item.latitude || '0',
                longitude: item.longitude || '0'
            }));
        } catch (error) {
            console.error('API Error:', error);
            req.reject(500, 'AFAD API hatası: ' + error.message);
            return [];
        }
    });
});

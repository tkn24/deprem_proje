
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel"
], function(Controller, MessageToast, JSONModel) {
  "use strict";
  return Controller.extend("depremapp.controller.App", {
      
      // Formatlama fonksiyonları
      formatDepremSeverity: function(magnitude) {
          if (!magnitude) return "None";
          if (magnitude < 2.0) return "Success";  // Yeşil
          if (magnitude < 4.0) return "Warning";  // Sarı
          if (magnitude < 5.0) return "Error";    // Kırmızı
          return "Indication10";                  // Koyu kırmızı (5.0+)
      },
      formatBuyukluk: function(magnitude) {
          if (magnitude === null || magnitude === undefined) return "N/A";
          return parseFloat(magnitude).toFixed(1); // 1.3 şeklinde gösterir
      },
      formatYakinlik: function(depth) {
          if (!depth) return "Bilinmiyor";
          if (depth < 5) return "Çok Yakın";
          if (depth < 10) return "Yakın";
          if (depth < 30) return "Orta";
          if (depth < 70) return "Derin";
          return "Çok Derin";
      },
      formatSaat: function(dateTime) {
          if (!dateTime) return "Bilinmiyor";
          try {
              const timePart = dateTime.split('T')[1] || '';
              return timePart.substring(0, 5); // HH:MM formatı
          } catch (e) {
              return "Bilinmiyor";
          }
      },
      formatTarih: function(dateTime) {
          if (!dateTime) return "Bilinmiyor";
          try {
              const datePart = dateTime.split('T')[0] || '';
              return datePart.split('-').reverse().join('.'); // DD.MM.YYYY formatı
          } catch (e) {
              return "Bilinmiyor";
          }
      },
      // Controller yaşam döngüsü fonksiyonları
      onInit: function() {
          this._initModels();
          this._loadDepremData();
      },
      _initModels: function() {
          // UI durum modeli
          this.getView().setModel(new JSONModel({
              loading: false,
              error: false,
              lastUpdated: null
          }), "ui");
          
          // Veri modeli
          this.getView().setModel(new JSONModel({
              depremler: []
          }), "view");
      },
      _loadDepremData: function() {
          const oUiModel = this.getView().getModel("ui");
          const oViewModel = this.getView().getModel("view");
          
          oUiModel.setProperty("/loading", true);
          oUiModel.setProperty("/error", false);
          fetch("/odata/v4/deprem/SonDepremler")
              .then(response => {
                  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                  return response.json();
              })
              .then(data => {
                  const formattedData = this._formatDepremData(data.value || []);
                  oViewModel.setProperty("/depremler", formattedData);
                  oUiModel.setProperty("/loading", false);
                  oUiModel.setProperty("/lastUpdated", new Date().toLocaleTimeString());
                  
                  // Başarılı yükleme bildirimi
                  MessageToast.show(`${formattedData.length} deprem verisi yüklendi`);
              })
              .catch(error => {
                  console.error("Veri yükleme hatası:", error);
                  oUiModel.setProperty("/loading", false);
                  oUiModel.setProperty("/error", true);
                  MessageToast.show(this.getView().getModel("i18n").getProperty("errorMessage"));
              });
      },
      _formatDepremData: function(rawData) {
          return rawData.map(item => ({
              ...item,
              // Verileri formatla
              date: item.date || new Date().toISOString(),
              magnitude: parseFloat(item.magnitude) || 0.0,
              depth: parseFloat(item.depth) || 0.0,
              latitude: item.latitude || '0',
              longitude: item.longitude || '0',
              location: item.location || 'Bilinmeyen Konum'
          }));
      },
      onRefresh: function() {
          this._loadDepremData();
      },
      onDepremSelected: function(oEvent) {
          const selectedDeprem = oEvent.getSource().getBindingContext("view").getObject();
          console.log("Seçilen deprem:", selectedDeprem);
          
      }
  });
});

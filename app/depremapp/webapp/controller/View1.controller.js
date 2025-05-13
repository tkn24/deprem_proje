sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    "use strict";
    return Controller.extend("deprem.ui.controller.App", {
        onInit: function() {
            var oModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModel);
            
            this.loadDepremData();
        },
        
        loadDepremData: function() {
            var that = this;
            fetch("/deprem/getSonDepremler")
                .then(response => response.json())
                .then(data => {
                    that.getView().getModel().setProperty("/depremler", data);
                })
                .catch(error => {
                    MessageToast.show("Deprem verileri yüklenirken hata oluştu: " + error);
                });
        },
        
        onRefresh: function() {
            this.loadDepremData();
        }
    });
});
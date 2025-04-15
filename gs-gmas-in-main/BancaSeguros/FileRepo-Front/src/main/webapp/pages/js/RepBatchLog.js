function onRBLLoad() {
	// Inicializar
	fRBLInitialize();
	fMnuDeselect();
}

function fRBLInitialize() {
	// Resize
	fBrowserResize();
	// Ancho de botones
	dojo.style("btnRBLBuscar", "width", "100px");
	// FechaHoy
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("ParametersService/getFechaHoy?cache="
				+ fGetCacheRnd());
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			if (!response.error || !!response.result) {
				fRBLParFecHoy(response.result);
			}
		});
	});
}

function fRBLParFecHoy(vRes) {
	document.getElementById("hidRBLFecHoy").value = vRes;
	dijit.byId("dtxRBLFecha").set("value",
			fFormatDTB(document.getElementById("hidRBLFecHoy").value));
}

function fRBLBuscar() {
	if (fSessionValidate().pSft) {
		fRBLBuscarExec();
	}
}

function fRBLBuscarExec() {
	if (dijit.byId("dtxRBLFecha").get("value") == null) {
		fMsgBox("La fecha es inv&aacute;lida.", "Validaci&oacute;n", "W");
		return;
	}
	var vFecha = dojo.date.locale.format(
			dijit.byId("dtxRBLFecha").get("value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
	if (vFecha > document.getElementById("hidRBLFecHoy").value) {
		fMsgBox("La fecha no debe ser mayor a la fecha actual.",
				"Validaci&oacute;n", "W");
		return;
	}
	// Cargar Lista Pefiles
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("OperationService/getBatchLogList?cache="
				+ fGetCacheRnd() + "&fecha=" + vFecha);
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			if (response.error) {
				vRet = false;
			} else {
				response = fJSONParse(response, 0);
				if (!response) {
					// No hacer nada
				} else {
					var vJSON = response.REGS;
					// Si da error
					if (vJSON == null) {
						return;
					}
					// Listado
					var vData = {
						items : vJSON.REG
					};
					var jsonDataSource = new ItemFileWriteStore({
						data : vData
					});

					var layout = [ [ {
						name : "Fecha",
						field : "FEC_BTC",
						width : "105px"
					}, {
						name : "Paso",
						field : "PAS_BTC",
						width : "80px"
					}, {
						name : "Descripci&oacute;n",
						fields : [ "PAS_BTC", "DES_BTC" ],
						formatter : fRBLDgrDes,
						width : "480px"
					} ] ];

					if (dijit.byId("dgrRBLBtcLog") == null) {
						oGrid = new DataGrid({
							id : "dgrRBLBtcLog",
							store : jsonDataSource,
							structure : layout,
							rowSelector : "25px",
							rowCount : 20,
							style : 'width: 760px; height: 400px;',
							selectionMode : "single"
						}, "_divRBLBtcLog");

						oGrid.startup();
					} else {
						dijit.byId("dgrRBLBtcLog").setStructure(layout);
						dijit.byId("dgrRBLBtcLog").setStore(jsonDataSource);
					}
					// Finalizar
					dijit.byId("dgrRBLBtcLog").update();
				}
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fRBLDgrDes(vVal) {
	var vRes = "";
	// Verificar paso
	if (String(vVal[0]) == "10" || String(vVal[0]) == "50") {
		vRes = "<b>" + vVal[1] + "</b>";
	} else {
		if (vVal[1].toUpperCase().indexOf("INICIO") == 0
				|| vVal[1].toUpperCase().indexOf("FIN") == 0) {
			vRes = "<i><b>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + vVal[1] + "</b></i>";
		} else {
			vRes = "&nbsp;&nbsp;&nbsp;&nbsp;" + "&nbsp;&nbsp;&nbsp;&nbsp;"
					+ vVal[1];
		}
	}
	return vRes;
}
function onPALLoad() {
	// Inicializar
	fPALInitialize();
	// ReadOnly
	fPALFasReadOnly(true);
	fPALEstClean();
	fMnuDeselect();
}

function fPALInitialize() {
	// Resize
	fBrowserResize();
	// Ancho de botones
	dojo.style("btnPALFasEditar", "width", "100px");
	dojo.style("btnPALFasGrabar", "width", "100px");
	dojo.style("btnPALFasCancel", "width", "100px");
	dojo.style("btnPALEstAdd", "width", "100px");
	dojo.style("btnPALEstDel", "width", "100px");
	// Cargar Combo Fases
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("ParametersService/getFaseList?cache="
				+ fGetCacheRnd() + "&perfil=X&producto=");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			if (response.error) {
				vRet = false;
			} else {
				response = fJSONParse(response, 2);
				if (!response) {
					// No hacer nada
				} else {
					fComboAllLoad(response, "cboPALFase", "COD_FAS", "DES_FAS",
							"...", " ");
				}
			}
		}, function(err) {
			vRet = false;
		});
	});
	// Cargar Combo Estados
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("ParametersService/getEstadoList?cache="
				+ fGetCacheRnd() + "&estadoActual=0");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			if (response.error) {
				vRet = false;
			} else {
				response = fJSONParse(response, 2);
				if (!response) {
					// No hacer nada
				} else {
					fComboAllLoad(response, "cboPALEstCod", "COD_EST",
							"DES_EST", "...", " ");
				}
			}
		}, function(err) {
			vRet = false;
		});
	});
}

function fPALFasReadOnly(value) {
	dijit.byId("cboPALFase").set("disabled", !value);
	dijit.byId("btnPALFasEditar").set("disabled", !value);
	dijit.byId("btnPALFasGrabar").set("disabled", value);
	dijit.byId("btnPALFasCancel").set("disabled", value);
	dijit.byId("btnPALEstAdd").set("disabled", value);
	dijit.byId("btnPALEstDel").set("disabled", value);
	dijit.byId("txtPALEmail").set("disabled", value);
	dijit.byId("txtPALEmailCC").set("disabled", value);
	dijit.byId("txtPALEmailCCO").set("disabled", value);
	dijit.byId("cboPALEstCod").set("disabled", value);
	dijit.byId("txtPALEstDia").set("disabled", value);
}

function fPALFasClean() {
	dijit.byId("cboPALFase").set("value", "");
}

function fPALEstClean() {
	dijit.byId("txtPALEmail").set("value", "");
	dijit.byId("txtPALEmailCC").set("value", "");
	dijit.byId("txtPALEmailCCO").set("value", "");
	dijit.byId("cboPALEstCod").set("value", "");
	dijit.byId("txtPALEstDia").set("value", "0");
	fGridClean("dgrPALEstado");
}

function fPALFasEditar() {
	if (fSessionValidate().pSft) {
		fPALFasEditarExec();
	}
}

function fPALFasEditarExec() {
	if (dijit.byId("cboPALFase").get("value") == "") {
		fMsgBox("Debe seleccionar una fase.", "B&uacute;squeda", "W");
		return;
	}
	// Cargar Alertas x Fase
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("ParametersService/getAlertaXFaseList?cache="
				+ fGetCacheRnd() + "&fase="
				+ dijit.byId("cboPALFase").get("value"));
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
					var vJSON = response.REGS.REG;
					if (vJSON.length > 0) {
						dijit.byId("txtPALEmail")
								.set("value", vJSON[0].EMA_REC);
						dijit.byId("txtPALEmailCC").set("value",
								vJSON[0].EMA_RCC);
						dijit.byId("txtPALEmailCCO").set("value",
								vJSON[0].EMA_RCO);
					}
					fPALFasEstado();
					fPALFasReadOnly(false);
				}
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fPALFasEstado() {
	// Cargar Alertas x Estado
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("ParametersService/getAlertaXEstadoList?cache="
				+ fGetCacheRnd() + "&fase="
				+ dijit.byId("cboPALFase").get("value"));
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
						name : "Estado",
						field : "DES_EST",
						width : "100px"
					}, {
						name : "D&iacute;as",
						field : "CAN_DIA",
						width : "50px"
					} ] ];

					if (dijit.byId("dgrPALEstado") == null) {
						oGrid = new DataGrid({
							id : "dgrPALEstado",
							store : jsonDataSource,
							structure : layout,
							rowSelector : "25px",
							rowCount : 20,
							style : 'width: 250px; height: 95px;',
							selectionMode : "single"
						}, "_divPALEstado");

						oGrid.startup();
					} else {
						dijit.byId("dgrPALEstado").setStructure(layout);
						dijit.byId("dgrPALEstado").setStore(jsonDataSource);
					}
					// Finalizar
					dijit.byId("dgrPALEstado").update();
				}
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fPALEstAdd() {
	// Validacion
	if (dijit.byId("cboPALEstCod").get("value") == "") {
		fMsgBox("Debe seleccionar un estado.", "Validaci&oacute;n", "W");
		return;
	}
	if (dijit.byId("txtPALEstDia").get("value") == undefined) {
		fMsgBox("Debe ingresar la cantidad de d&iacute;as correctamente.",
				"Validaci&oacute;n", "W");
		return false;
	}
	// Agregar
	var oGrid = dijit.byId("dgrPALEstado");
	var jsonDataSource = oGrid.store;
	var vEnc = false;
	// Buscar si existe
	jsonDataSource.fetch({
		query : {
			COD_EST : dijit.byId("cboPALEstCod").get("value")
		},
		onItem : function(item) {
			jsonDataSource.setValue(item, 'COD_EST', dijit.byId("cboPALEstCod")
					.get("value"));
			jsonDataSource.setValue(item, 'DES_EST', dijit.byId("cboPALEstCod")
					.get("displayedValue"));
			jsonDataSource.setValue(item, 'CAN_DIA', dijit.byId("txtPALEstDia")
					.get("value"));
			vEnc = true;
		}
	});
	if (!vEnc) {
		var vNewItem = {
			COD_EST : dijit.byId("cboPALEstCod").get("value"),
			DES_EST : dijit.byId("cboPALEstCod").get("displayedValue"),
			CAN_DIA : dijit.byId("txtPALEstDia").get("value")
		};
		jsonDataSource.newItem(vNewItem);
	}
	oGrid.setStore(jsonDataSource);
	oGrid.update();
	// Limpiar
	dijit.byId("cboPALEstCod").set("value", "");
	dijit.byId("txtPALEstDia").set("value", "0");
}

function fPALEstDel() {
	var oGrid = dijit.byId("dgrPALEstado");
	var oItems = oGrid.selection.getSelected();
	var jsonDataSource = oGrid.store;
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un estado.", "Advertencia", "W");
		return;
	} else {
		dojo.forEach(oItems, function(selectedItem) {
			if (selectedItem !== null) {
				// Delete the item from the data store:
				jsonDataSource.deleteItem(selectedItem);
			}
		});
		oGrid.setStore(jsonDataSource);
		oGrid.update();
	}
}

function fPALFasCancel() {
	if (fSessionValidate().pSft) {
		fPALFasCancelExec();
	}
}

function fPALGrabar() {
	if (fSessionValidate().pSft) {
		fPALGrabarExec();
	}
}

function fPALGrabarExec() {
	// Validacion
	if (String(dijit.byId("txtPALEmail").get("value")).length == 0
			|| !fValType("M", String(dijit.byId("txtPALEmail").get("value")))) {
		fMsgBox("Debe ingresar un email v&aacute;lido.", "Validaci&oacute;n",
				"W");
		return;
	}
	if (String(dijit.byId("txtPALEmailCC").get("value")).length > 0
			&& !fValType("M", String(dijit.byId("txtPALEmailCC").get("value")))) {
		fMsgBox("Debe ingresar un emailCC v&aacute;lido.", "Validaci&oacute;n",
				"W");
		return;
	}
	if (String(dijit.byId("txtPALEmailCCO").get("value")).length > 0
			&& !fValType("M", String(dijit.byId("txtPALEmailCCO").get("value")))) {
		fMsgBox("Debe ingresar un emailCCO v&aacute;lido.",
				"Validaci&oacute;n", "W");
		return;
	}
	// Grabacion
	fWaitMsgBoxIni("Grabando", [ "Grabando Datos..." ]);
	require(
			[ "dojo/request", "dojo/data/ItemFileWriteStore", "dojo/domReady!" ],
			function(request, ItemFileWriteStore) {
				var vURL = fGetURLSvc("ParametersService/setAlertaXFase?"
						+ fPALGetParam());
				var deferred = request.get(vURL, {
					handleAs : "json",
					sync : true
				});
				deferred
						.then(function(response) {
							response = fJSONParse(response);
							if (!response) {
								fWaitMsgBoxClose();
							} else {
								var vJSON = response.REGS.REG[0];
								// Si da error
								if (vJSON.RES_MSG != "OK") {
									fWaitMsgBoxUpd(0,
											"Se ha producido un error.", "E");
									fWaitMsgBoxClose();
									return;
								}
								fWaitMsgBoxUpd(0, "Grabaci&oacute;n exitosa!",
										"O");
								fWaitMsgBoxClose();
								fPALFasReadOnly(true);
								fPALFasClean();
								fPALEstClean();
							}
						},
								function(err) {
									fWaitMsgBoxUpd(0,
											"Se ha producido un error.", "E");
									fWaitMsgBoxClose();
								});
			});
}

function fPALGetParam() {
	vParam = "";
	vParam += "cache=" + fGetCacheRnd();
	vParam += "&fase=" + fEncodeURI(dijit.byId("cboPALFase").get("value"));
	vParam += "&email=" + fEncodeURI(dijit.byId("txtPALEmail").get("value"));
	vParam += "&emailCC="
			+ fEncodeURI(dijit.byId("txtPALEmailCC").get("value"));
	vParam += "&emailCCO="
			+ fEncodeURI(dijit.byId("txtPALEmailCCO").get("value"));
	vParam += "&jsonEstadoList=" + fEncodeURI(fPALGetParEst());
	return vParam;
}

function fPALGetParEst() {
	// Pasar a string array de Estados
	var oGridStore = dijit.byId("dgrPALEstado").store._arrayOfTopLevelItems;
	var vRet = '{"estadoList":[';

	for (var i = 0; i < oGridStore.length; i++) {
		vRet += '{';
		vRet += '"cEst":' + oGridStore[i].COD_EST + ',';
		vRet += '"cDia":' + oGridStore[i].CAN_DIA;
		vRet += '}';
		if (i < (oGridStore.length - 1)) {
			vRet += ',';
		}
	}
	vRet += ']}';
	return vRet;
}

function fPALFasCancelExec() {
	// ReadOnly
	fPALFasReadOnly(true);
	fPALFasClean();
	fPALEstClean();
}

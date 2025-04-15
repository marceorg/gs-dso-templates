function onPPELoad() {
	// Inicializar
	fPPEInitialize();
	// ReadOnly
	fPPEPerReadOnly(true);
	fPPEFasReadOnly(true);
	fMnuDeselect();
}

function fPPEInitialize() {
	// Resize
	fBrowserResize();
	// Ancho de botones
	dojo.style("btnPPEPerEditar", "width", "100px");
	dojo.style("btnPPEPerCancel", "width", "100px");
	dojo.style("btnPPEFasEditar", "width", "100px");
	dojo.style("btnPPEFasGrabar", "width", "100px");
	dojo.style("btnPPEFasCancel", "width", "100px");
	// Cargar Combo Pefiles
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("ParametersService/getPerfilList?cache="
				+ fGetCacheRnd());
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
					fComboAllLoad(response, "cboPPEPerfil", "COD_PER",
							"DES_PER", "...", " ");
				}
			}
		}, function(err) {
			vRet = false;
		});
	});
}

function fPPEPerReadOnly(value) {
	dijit.byId("cboPPEPerfil").set("disabled", !value);
	dijit.byId("btnPPEPerEditar").set("disabled", !value);
	dijit.byId("btnPPEPerCancel").set("disabled", value);
	dijit.byId("btnPPEFasEditar").set("disabled", value);
}

function fPPEPerClean() {
	dijit.byId("cboPPEPerfil").set("value", "");
	fGridClean("dgrPPEFase");
}

function fPPEFasReadOnly(value) {
	dijit.byId("btnPPEFasGrabar").set("disabled", value);
	dijit.byId("btnPPEFasCancel").set("disabled", value);
	dijit.byId("cboPPEReqRev").set("disabled", value);
	dijit.byId("cboPPEPAnLec").set("disabled", value);
	dijit.byId("cboPPEPSuLec").set("disabled", value);
	dijit.byId("cboPPEPAnAlt").set("disabled", value);
	dijit.byId("cboPPEPSuAlt").set("disabled", value);
	dijit.byId("cboPPEPAnBaj").set("disabled", value);
	dijit.byId("cboPPEPSuBaj").set("disabled", value);
}

function fPPEFasClean() {
	dijit.byId("tpnPPEFase").set("open", false);
	dijit.byId("txtPPEFase").set("value", "");
	dijit.byId("txtPPEFase").set("valueCod", 0);
	dijit.byId("cboPPEReqRev").set("value", "N");
	dijit.byId("cboPPEPAnLec").set("value", "N");
	dijit.byId("cboPPEPSuLec").set("value", "N");
	dijit.byId("cboPPEPAnAlt").set("value", "N");
	dijit.byId("cboPPEPSuAlt").set("value", "N");
	dijit.byId("cboPPEPAnBaj").set("value", "N");
	dijit.byId("cboPPEPSuBaj").set("value", "N");
}

function fPPEPerEditar() {
	if (fSessionValidate().pSft) {
		fPPEPerEditarExec();
	}
}

function fPPEPerEditarExec() {
	if (dijit.byId("cboPPEPerfil").get("value") == "") {
		fMsgBox("Debe seleccionar un perfil.", "B&uacute;squeda", "W");
		return;
	}
	// Cargar Lista Pefiles
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("ParametersService/getFaseList?cache="
				+ fGetCacheRnd() + "&perfil="
				+ dijit.byId("cboPPEPerfil").get("value") + "&producto=");
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
						name : "Fase",
						field : "DES_FAS",
						width : "200px"
					}, {
						name : "Req.Revisi&oacute;n",
						field : "REQ_REV",
						formatter : fDgrColBln,
						width : "70px"
					}, {
						name : "Analista Lectura",
						field : "PAN_LEC",
						formatter : fDgrColBln,
						width : "60px"
					}, {
						name : "Analista Alta Doc.",
						field : "PAN_ALT",
						formatter : fDgrColBln,
						width : "60px"
					}, {
						name : "Analista Baja Doc.",
						field : "PAN_BAJ",
						formatter : fDgrColBln,
						width : "60px"
					}, {
						name : "Supervisor Lectura",
						field : "PSU_LEC",
						formatter : fDgrColBln,
						width : "60px"
					}, {
						name : "Supervisor Alta Doc.",
						field : "PSU_ALT",
						formatter : fDgrColBln,
						width : "60px"
					}, {
						name : "Supervisor Baja Doc.",
						field : "PSU_BAJ",
						formatter : fDgrColBln,
						width : "60px"
					} ] ];

					if (dijit.byId("dgrPPEFase") == null) {
						oGrid = new DataGrid({
							id : "dgrPPEFase",
							store : jsonDataSource,
							structure : layout,
							rowSelector : "25px",
							rowCount : 20,
							style : 'width: 760px; height: 100px;',
							selectionMode : "single"
						}, "_divPPEFase");

						oGrid.startup();
					} else {
						dijit.byId("dgrPPEFase").setStructure(layout);
						dijit.byId("dgrPPEFase").setStore(jsonDataSource);
					}
					// Finalizar
					dijit.byId("dgrPPEFase").update();
					fPPEPerReadOnly(false);
					fPPEFasReadOnly(true);
				}
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fPPEPerCancel() {
	if (fSessionValidate().pSft) {
		fPPEPerCancelExec();
	}
}

function fPPEPerCancelExec() {
	// ReadOnly
	fPPEPerReadOnly(true);
	fPPEFasReadOnly(true);
	fPPEPerClean();
	fPPEFasClean();
}

function fPPEFasEditar() {
	if (fSessionValidate().pSft) {
		fPPEFasEditarExec();
	}
}

function fPPEFasEditarExec() {
	var oGrid = dijit.byId("dgrPPEFase");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una fase.", "Advertencia", "W");
		return;
	}
	// Botones y paneles
	fPPEFasReadOnly(false);
	dijit.byId("btnPPEFasEditar").set("disabled", true);
	dijit.byId("tpnPPEFase").set("open", true);
	// Datos
	dijit.byId("txtPPEFase").set("value", oItems[0].DES_FAS[0]);
	dijit.byId("txtPPEFase").set("valueCod", oItems[0].COD_FAS[0]);
	dijit.byId("cboPPEReqRev").set("value", oItems[0].REQ_REV[0] ? "S" : "N");
	dijit.byId("cboPPEPAnLec").set("value", oItems[0].PAN_LEC[0] ? "S" : "N");
	dijit.byId("cboPPEPSuLec").set("value", oItems[0].PSU_LEC[0] ? "S" : "N");
	dijit.byId("cboPPEPAnAlt").set("value", oItems[0].PAN_ALT[0] ? "S" : "N");
	dijit.byId("cboPPEPSuAlt").set("value", oItems[0].PSU_ALT[0] ? "S" : "N");
	dijit.byId("cboPPEPAnBaj").set("value", oItems[0].PAN_BAJ[0] ? "S" : "N");
	dijit.byId("cboPPEPSuBaj").set("value", oItems[0].PSU_BAJ[0] ? "S" : "N");
}

function fPPEGrabar() {
	if (fSessionValidate().pSft) {
		fPPEGrabarExec();
	}
}

function fPPEGrabarExec() {
	// Grabacion
	fWaitMsgBoxIni("Grabando", [ "Grabando Datos..." ]);
	require(
			[ "dojo/request", "dojo/data/ItemFileWriteStore", "dojo/domReady!" ],
			function(request, ItemFileWriteStore) {
				var vURL = fGetURLSvc("ParametersService/setPerfil?"
						+ fPPEGetParam());
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
								// Cargar Lista
								fPPEFasCancelExec();
								fPPEPerEditarExec();
								fWaitMsgBoxUpd(0, "Grabaci&oacute;n exitosa!",
										"O");
								fWaitMsgBoxClose();
							}
						},
								function(err) {
									fWaitMsgBoxUpd(0,
											"Se ha producido un error.", "E");
									fWaitMsgBoxClose();
								});
			});
}

function fPPEGetParam() {
	vParam = "";
	vParam += "cache=" + fGetCacheRnd();
	vParam += "&perfil=" + dijit.byId("cboPPEPerfil").get("value");
	vParam += "&fase=" + dijit.byId("txtPPEFase").get("valueCod");
	vParam += "&reqRevision="
			+ (dijit.byId("cboPPEReqRev").get("value") == "S" ? "true"
					: "false");
	vParam += "&pAnaLectura="
			+ (dijit.byId("cboPPEPAnLec").get("value") == "S" ? "true"
					: "false");
	vParam += "&pAnaAlta="
			+ (dijit.byId("cboPPEPAnAlt").get("value") == "S" ? "true"
					: "false");
	vParam += "&pAnaBaja="
			+ (dijit.byId("cboPPEPAnBaj").get("value") == "S" ? "true"
					: "false");
	vParam += "&pSupLectura="
			+ (dijit.byId("cboPPEPSuLec").get("value") == "S" ? "true"
					: "false");
	vParam += "&pSupAlta="
			+ (dijit.byId("cboPPEPSuAlt").get("value") == "S" ? "true"
					: "false");
	vParam += "&pSupBaja="
			+ (dijit.byId("cboPPEPSuBaj").get("value") == "S" ? "true"
					: "false");
	return vParam;
}

function fPPEFasCancel() {
	if (fSessionValidate().pSft) {
		fPPEFasCancelExec();
	}
}

function fPPEFasCancelExec() {
	// ReadOnly
	fPPEFasReadOnly(true);
	dijit.byId("btnPPEFasEditar").set("disabled", false);
	fPPEFasClean();
}

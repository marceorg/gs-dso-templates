function onPTDLoad() {
	// Inicializar
	fPTDInitialize();
	// Cargar
	fPTDDataLoad(1);
	// ReadOnly
	fPTDReadOnly(true);
	fMnuDeselect();
}

function fPTDInitialize() {
	// Resize
	fBrowserResize();
	// Ancho de botones
	dojo.style("btnPTDNuevo", "width", "100px");
	dojo.style("btnPTDEditar", "width", "100px");
	dojo.style("btnPTDGrabar", "width", "100px");
	dojo.style("btnPTDCancel", "width", "100px");
	// Grupos Documentales
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("ParametersService/getGrupoDocumentalList?cache="
				+ fGetCacheRnd());
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			if (!response.error) {
				response = fJSONParse(response, 2);
				if (!!response) {
					fComboAllLoad(response, "cboPTDGrupo", "COD_GDO",
							"DES_GDO", "...", "0");
				}
			}
		});
	});
}

function fPTDReadOnly(value) {
	// Lista
	dijit.byId("btnPTDNuevo").set("disabled", !value);
	dijit.byId("btnPTDEditar").set("disabled", !value);
	// Datos
	dijit.byId("txtPTDDescripcion").set("disabled", value);
	dijit.byId("cboPTDGrupo").set("disabled", value);
	dijit.byId("cboPTDIndBaja").set("disabled", value);
	dijit.byId("cboPTDIndBorrado").set("disabled", value);
	dijit.byId("txtPTDCodFileNet").set("disabled", value);
	dijit.byId("btnPTDGrabar").set("disabled", value);
	dijit.byId("btnPTDCancel").set("disabled", value);
}

function fPTDClean() {
	// Datos
	dijit.byId("txtPTDCodigo").set("value", "");
	dijit.byId("txtPTDDescripcion").set("value", "");
	dijit.byId("cboPTDGrupo").set("value", "0");
	dijit.byId("cboPTDIndBaja").set("value", "N");
	dijit.byId("cboPTDIndBorrado").set("value", "N");
	dijit.byId("txtPTDCodFileNet").set("value", "");
}

function fPTDDataLoad(vTMs) {
	// Consulta
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("ParametersService/getTipoDocumentalList?cache="
				+ fGetCacheRnd() + "&tipoDoc=0&grupoDoc=0&indBaja=false");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			response = fJSONParse(response, vTMs);
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
					name : "Descripci&oacute;n",
					field : "DES_TDO",
					width : "220px"
				}, {
					name : "Grupo",
					field : "DES_GDO",
					width : "200px"
				}, {
					name : "Baja",
					field : "IND_BAJ",
					formatter : fDgrColBln,
					width : "40px"
				}, {
					name : "Borrado",
					field : "IND_BOR",
					formatter : fDgrColBln,
					width : "40px"
				}, {
					name : "Cod.FileNet",
					field : "COD_FLN",
					width : "100px"
				}, {
					name : "Usuario",
					field : "COD_USU",
					width : "80px"
				}, {
					name : "Fecha",
					field : "FEC_MAN",
					formatter : fDgrColFec,
					width : "80px"
				} ] ];

				if (dijit.byId("dgrPTDLista") == null) {
					oGrid = new DataGrid({
						id : "dgrPTDLista",
						store : jsonDataSource,
						structure : layout,
						rowSelector : "25px",
						rowCount : 20,
						style : 'width: 890px; height: 230px;',
						selectionMode : "single"
					}, "_divPTDLista");

					oGrid.startup();
				} else {
					dijit.byId("dgrPTDLista").setStructure(layout);
					dijit.byId("dgrPTDLista").setStore(jsonDataSource);
				}
				// Botones y paneles
				dijit.byId("tpnPTDDatos").set("open", false);
				dijit.byId("tpnPTDLista").set("open", true);
				dijit.byId("dgrPTDLista").update();
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fPTDNuevo() {
	if (fSessionValidate().pSft) {
		fPTDNuevoExec();
	}
}

function fPTDNuevoExec() {
	// Botones y paneles
	fPTDReadOnly(false);
	dijit.byId("tpnPTDDatos").set("open", true);
	dijit.byId("tpnPTDLista").set("open", false);
	// Datos
	dijit.byId("txtPTDCodigo").set("value", "NUEVO");
}

function fPTDEditar() {
	if (fSessionValidate().pSft) {
		fPTDEditarExec();
	}
}

function fPTDEditarExec() {
	var oGrid = dijit.byId("dgrPTDLista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una fila.", "Advertencia", "W");
		return;
	}
	// Botones y paneles
	fPTDReadOnly(false);
	dijit.byId("tpnPTDDatos").set("open", true);
	dijit.byId("tpnPTDLista").set("open", false);
	// Datos
	dijit.byId("txtPTDCodigo").set("value", oItems[0].COD_TDO[0]);
	dijit.byId("txtPTDDescripcion").set("value", oItems[0].DES_TDO[0]);
	dijit.byId("cboPTDGrupo").set("value", oItems[0].COD_GDO[0]);
	dijit.byId("cboPTDIndBaja").set("value", oItems[0].IND_BAJ[0] ? "S" : "N");
	dijit.byId("cboPTDIndBorrado").set("value",
			oItems[0].IND_BOR[0] ? "S" : "N");
	dijit.byId("txtPTDCodFileNet").set("value", oItems[0].COD_FLN[0]);
}

function fPTDGrabar() {
	if (fSessionValidate().pSft) {
		fPTDGrabarExec();
	}
}

function fPTDGrabarExec() {
	// Validacion
	if (String(dijit.byId("txtPTDDescripcion").get("value")).length == 0
			|| !fValType("R", dijit.byId("txtPTDDescripcion").get("value"))) {
		fMsgBox("Descripci&oacute;n inv&aacute;lida.", "Validaci&oacute;n", "W");
		return;
	}
	if (dijit.byId("cboPTDGrupo").get("value") == "0"
			|| dijit.byId("cboPTDGrupo").get("value") == "") {
		fMsgBox("Debe seleccionar un grupo documental.", "Validaci&oacute;n",
				"W");
		return;
	}
	if (String(dijit.byId("txtPTDCodFileNet").get("value")).length > 0) {
		if (!fValType("R", dijit.byId("txtPTDCodFileNet").get("value"))) {
			fMsgBox("C&oacute;digo FileNet inv&aacute;lido.",
					"Validaci&oacute;n", "W");
			return;
		}
	}
	// Grabacion
	fWaitMsgBoxIni("Grabando", [ "Grabando Datos..." ]);
	require(
			[ "dojo/request", "dojo/data/ItemFileWriteStore", "dojo/domReady!" ],
			function(request, ItemFileWriteStore) {
				var vURL = fGetURLSvc("ParametersService/setTipoDocumental?"
						+ fPTDGetParam());
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
								// ReadOnly
								fPTDReadOnly(true);
								fPTDClean();
								// Cargar Lista
								fGridClean("dgrPTDLista");
								fPTDDataLoad(0);
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

function fPTDGetParam() {
	vParam = "";
	vParam += "cache=" + fGetCacheRnd();
	if (!dijit.byId("txtPTDCodigo").get("value")) {
		vParam += "&tipoDoc=0";
	} else {
		vParam += "&tipoDoc=" + dijit.byId("txtPTDCodigo").get("value");
	}
	vParam += "&descripcion="
			+ fEncodeURI(dijit.byId("txtPTDDescripcion").get("value"));
	vParam += "&grupoDoc=" + dijit.byId("cboPTDGrupo").get("value");
	vParam += "&indBaja="
			+ (dijit.byId("cboPTDIndBaja").get("value") == "S" ? "true"
					: "false");
	vParam += "&indBorrado="
			+ (dijit.byId("cboPTDIndBorrado").get("value") == "S" ? "true"
					: "false");
	vParam += "&codFileNet="
			+ fEncodeURI(dijit.byId("txtPTDCodFileNet").get("value"));
	return vParam;
}

function fPTDCancel() {
	if (fSessionValidate().pSft) {
		fPTDCancelExec();
	}
}

function fPTDCancelExec() {
	// ReadOnly
	fPTDReadOnly(true);
	fPTDClean();
	// Botones y paneles
	dijit.byId("tpnPTDDatos").set("open", false);
	dijit.byId("tpnPTDLista").set("open", true);
}

function onCCLLoad() {
	// Inicializar
	fCCLInitialize();
	// ReadOnly
	fCCLReadOnly(true);
	// Tomar parametro
	var vParApe = fGetParamURL("apellido");
	var vParTDo = fGetParamURL("tipDoc");
	var vParNDo = fGetParamURL("nroDoc");
	var vParCia = fGetParamURL("companiaPar");
	var vParPol = fGetParamURL("polizaPar");
	var vParPSt = fGetParamURL("paramStart");
	if (vParTDo != "") {
		dijit.byId("txtCCLApeRaz").set("value", vParApe.substr(9, 20));
		dijit.byId("cboCCLTipDoc").set("value", vParTDo.substr(7, 2), false);
		fCCLTDoSel(dijit.byId("cboCCLTipDoc").get("value"));
		dijit.byId("txtCCLNroDoc").set("value", vParNDo.substr(7, 11));
		dijit.byId("cboCCLCompania").set("value", vParCia.substr(12, 4), false);
		fCCLCiaSel(dijit.byId("cboCCLCompania").get("value"));
		dijit.byId("txtCCLPoliza").set("value", vParPol.substr(10, 40));
		document.getElementById("hidCCLParamStart").value = vParPSt.substr(11,
				56);
		fSessionValidate('fCCLDataLoad');
	}
}

function fCCLInitialize() {
	// Resize
	fBrowserResize();
	// Cargar Combo Tipos de documento
	require([ "dojo/request", "dojo/domReady!" ], function(request) {

		var vURL = fGetURLSvc("ParametersService/getTipoDocList");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});

		deferred.then(function(response) {
			if (response.error) {
				vRet = false;
			} else {
				fComboAllLoad(response, "cboCCLTipDoc", "...", "0");
			}
		}, function(err) {
			vRet = false;
		});
	});
	// Cargar Combo Companias
	require([ "dojo/request", "dojo/domReady!" ], function(request) {

		var vURL = fGetURLSvc("ParametersService/getCompaniaList");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});

		deferred.then(function(response) {
			if (response.error) {
				vRet = false;
			} else {
				fComboAllLoad(response, "cboCCLCompania", "...", "0");
			}
		}, function(err) {
			vRet = false;
		});
	});
}

function fCCLReadOnly(value) {
	dijit.byId("btnCCLDetPol").set("disabled", value);
	dijit.byId("btnCCLDetCli").set("disabled", value);
	dijit.byId("btnCCLPagSig").set("disabled", value);
	dijit.byId("btnCCLExcel").set("disabled", value);
}

function fCCLClean() {
	fGridClean("dgrCCLLista");
	dijit.byId("tpnCCLLista").set("open", false);
}

function fCCLDataLoad() {
	// Espera
	fWaitMsgBoxIni("Consultando", [ "Consultando Informaci&oacute;n..." ]);

	// Determinar tipo de b�squeda
	var vTipoBusqueda = "N";
	if (dijit.byId("cboCCLTipDoc").get("value") != 0) {
		vTipoBusqueda = "D";
	} else if (dijit.byId("cboCCLCompania").get("value") != 0) {
		vTipoBusqueda = "P";
	}
	document.getElementById("hidCCLParamStartAnt").value = document
			.getElementById("hidCCLParamStart").value;
	// Consulta Clientes
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var url = fGetURLSvc("BSService/getConClienteList?cache="
				+ fGetCacheRnd() + "&tipoBusqueda=" + vTipoBusqueda
				+ "&tipDoc=" + dijit.byId("cboCCLTipDoc").get("value")
				+ "&nroDoc=" + dijit.byId("txtCCLNroDoc").get("value")
				+ "&apellido=" + dijit.byId("txtCCLApeRaz").get("value")
				+ "&compania=" + dijit.byId("cboCCLCompania").get("value")
				+ "&poliza=" + dijit.byId("txtCCLPoliza").get("value")
				+ "&paramStart="
				+ document.getElementById("hidCCLParamStart").value);
		var deferred = request.get(url, {
			handleAs : "json"
		});

		deferred.then(function(response) {
			// Manejar Respuesta
			if (response.error) {
				fWaitMsgBoxUpd(0,
						"Se ha producido un error en la consulta.(TO)", "E");
				fWaitMsgBoxClose();
				return;
			}

			var vJSON = response.result.conClienteList;
			var vPStart = response.result.paramStart;
			document.getElementById("hidCCLParamStart").value = vPStart;

			// Si da error
			if (vJSON == null) {
				fWaitMsgBoxUpd(0,
						"Se ha producido un error en la consulta.(AS)", "E");
				fWaitMsgBoxClose();
				return;
			}
			// Si no trae nada
			if (vJSON.length == 0) {
				fWaitMsgBoxUpd(0,
						"No se encontr&oacute; ning&uacute;n registro.", "W");
				fWaitMsgBoxClose();
				return;
			}

			// Listado
			var vData = {
				items : vJSON
			};
			var jsonDataSource = new ItemFileWriteStore({
				data : vData
			});

			var layout = [ [ {
				name : "Compa&ntilde;&iacute;a",
				field : "compania",
				formatter : fDgrColTDo,
				width : "100px"
			}, {
				name : "Producto",
				field : "producto",
				width : "140px"
			}, {
				name : "P&oacute;liza",
				field : "poliza",
				width : "200px"
			}, {
				name : "End.",
				field : "endoso",
				width : "30px"
			}, {
				name : "Apellido / Nombre",
				field : "tomador",
				width : "160px"
			}, {
				name : "Estado",
				field : "estado",
				width : "40px"
			} ] ];

			if (dijit.byId("dgrCCLLista") == null) {
				oGrid = new DataGrid({
					id : "dgrCCLLista",
					store : jsonDataSource,
					structure : layout,
					rowSelector : "25px",
					rowCount : 20,
					style : 'width: 890px; height: 230px;',
					selectionMode : "single"
				}, "_divCCLLista");

				oGrid.startup();
			} else {
				dijit.byId("dgrCCLLista").setStructure(layout);
				dijit.byId("dgrCCLLista").setStore(jsonDataSource);
			}

			// Botones y paneles
			dijit.byId("tpnCCLParam").set("open", false);
			dijit.byId("tpnCCLLista").set("open", true);
			fCCLReadOnly(false);
			if (vPStart == "") {
				dijit.byId("btnCCLPagSig").set("disabled", true);
			}

			// Mensaje de exito
			fWaitMsgBoxUpd(0, "Informe cargado.", "O");
			fWaitMsgBoxClose();
			dijit.byId("dlgWait").onCancel();

			dijit.byId("dgrCCLLista").update();

			fMnuDeselect();
		}, function(err) {
			fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.", "E");
			fWaitMsgBoxClose();
		});
	});
}

function fCCLTDoSel(value) {
	dijit.byId("txtCCLNroDoc").set("value", "");
	if (value == "0") {
		dijit.byId("txtCCLNroDoc").set("disabled", true);
	} else {
		dijit.byId("txtCCLNroDoc").set("disabled", false);
	}
}

function fCCLCiaSel(value) {
	dijit.byId("txtCCLPoliza").set("value", "");
	document.getElementById("lblCCLPolEjemplo").innerHTML = "";
	if (value == "0") {
		dijit.byId("txtCCLPoliza").set("disabled", true);
	} else {
		dijit.byId("txtCCLPoliza").set("disabled", false);
		// Se determina por compa��a el ejemplo de p�liza a mostrar (formato)
		require(
				[ "dojo/request", "dojo/domReady!" ],
				function(request) {

					var vURL = fGetURLSvc("ParametersService/getCompaniaList");
					var deferred = request.get(vURL, {
						handleAs : "json",
						sync : true
					});

					deferred
							.then(function(response) {
								if (!response.error) {
									for ( var i in response.result) {
										if (String(response.result[i].id) == dijit
												.byId("cboCCLCompania").get(
														"value")) {
											document
													.getElementById("lblCCLPolEjemplo").innerHTML = response.result[i].ejePoliza;
											break;
										}
									}
								}
							});
				});
	}
}

function fCCLBuscar() {
	// ReadOnly y Clean
	fCCLReadOnly(true);
	fCCLClean();

	// Validacion
	if (String(dijit.byId("txtCCLApeRaz").get("value")).length == 0
			&& dijit.byId("cboCCLTipDoc").get("value") == 0
			&& dijit.byId("cboCCLCompania").get("value") == 0) {
		fMsgBox("Debe ingresar alg&uacute;n par&aacute;metro.",
				"Validaci&oacute;n", "E");
		return;
	}
	if ((String(dijit.byId("txtCCLApeRaz").get("value")).length > 0 && dijit
			.byId("cboCCLTipDoc").get("value") != 0)
			|| (String(dijit.byId("txtCCLApeRaz").get("value")).length > 0 && dijit
					.byId("cboCCLCompania").get("value") != 0)
			|| (dijit.byId("cboCCLTipDoc").get("value") != 0 && dijit.byId(
					"cboCCLCompania").get("value") != 0)) {
		fMsgBox("Debe buscar por un solo par&aacute;metro.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("cboCCLTipDoc").get("value") != 0
			&& String(dijit.byId("txtCCLNroDoc").get("value")).length == 0) {
		fMsgBox("Debe ingresar un n&uacute;mero de documento.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("cboCCLCompania").get("value") != 0
			&& String(dijit.byId("txtCCLPoliza").get("value")).length == 0) {
		fMsgBox("Debe un n&uacute;mero de p&oacute;liza.", "Validaci&oacute;n",
				"E");
		return;
	}

	// Cargar Lista
	document.getElementById("hidCCLParamStart").value = "";
	document.getElementById("hidCCLParamStartAnt").value = "";
	fSessionValidate('fCCLDataLoad');
}

function fCCLPagSig() {
	fSessionValidate('fCCLDataLoad');
}

function fCCLExcel() {
	fSessionValidate('fCCLExcelExec');
}

function fCCLExcelExec() {
	// Determinar tipo de b�squeda
	var vTipoBusqueda = "N";
	if (dijit.byId("cboCCLTipDoc").get("value") != 0) {
		vTipoBusqueda = "D";
	} else if (dijit.byId("cboCCLCompania").get("value") != 0) {
		vTipoBusqueda = "P";
	}

	window.open(fGetURLMVC("downloadSvc.html?tipoInforme=CCL&"
			+ "tipoBusqueda=" + vTipoBusqueda + "&tipDoc="
			+ dijit.byId("cboCCLTipDoc").get("value") + "&nroDoc="
			+ dijit.byId("txtCCLNroDoc").get("value") + "&apellido="
			+ dijit.byId("txtCCLApeRaz").get("value") + "&compania="
			+ dijit.byId("cboCCLCompania").get("value") + "&poliza="
			+ dijit.byId("txtCCLPoliza").get("value")), "download",
			"resizable=yes,height=65,width=150,top=50,left=100");
}

function fCCLImpreso() {
	fSessionValidate('fCCLImpresoExec');
}

function fCCLImpresoExec() {
	var oGrid = dijit.byId("dgrCCLLista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una operaci&oacute;n.", "Advertencia", "W");
		return;
	}
	var vEndoso = fFormatFill(String(oItems[0].endoso), 4, "0");
	// orden=0 pza.qbe orden=2 mercosur.qbe
	if (oItems[0].compania[0].id == 1) {
		var vPoliza = oItems[0].poliza;
		if (vPoliza[0].substring(0, 4) == 'AUS1') {
			document.getElementById("hQBEBoxFnc").value = "fQBEImprimeQBE ('"
					+ oItems[0].poliza + "','" + vEndoso + "'";
			fQBEBox("Seleccione el impreso que desea obtener");
		} else {
			fQBEImprimeQBE(oItems[0].poliza, vEndoso, 0);
		}
	} else if (oItems[0].compania[0].id == 20) {
		window.open(fGetURLMVC("retrieveSvc.html?" + "cache=" + fGetCacheRnd()
				+ "&tipo=P&" + "orden=1&poliza=" + oItems[0].poliza + "-"
				+ fFormatFill(String(oItems[0].endoso), 4, "0")), "retrieve",
				"resizable=yes,height=550,width=750,top=50,left=100");
	} else {
		fMsgBox(
				"La Compa&ntilde;&iacute;a no tiene servicio de impresi&oacute;n",
				"Advertencia", "W");
	}
}

function fCCLDetPol() {
	fSessionValidate('fCCLDetPolExec');
}

function fCCLDetPolExec() {
	var oGrid = dijit.byId("dgrCCLLista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una operaci&oacute;n.", "Advertencia", "W");
		return;
	}
	url = fGetURLPag("interface/ConPolizaDet.html?compania="
			+ oItems[0].compania[0].id + "&companiaDes="
			+ oItems[0].compania[0].name + "&poliza=" + oItems[0].poliza
			+ "&endoso=" + oItems[0].endoso + "&tipoInforme=CCL&" + "&tipDoc="
			+ dijit.byId("cboCCLTipDoc").get("value") + "&nroDoc="
			+ dijit.byId("txtCCLNroDoc").get("value") + "&apellido="
			+ dijit.byId("txtCCLApeRaz").get("value") + "&companiaPar="
			+ dijit.byId("cboCCLCompania").get("value") + "&polizaPar="
			+ dijit.byId("txtCCLPoliza").get("value") + "&paramStart="
			+ document.getElementById("hidCCLParamStartAnt").value);
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onCPDLoad();
	});

}

function fCCLDetCli() {
	fSessionValidate('fCCLDetCliExec');
}

function fCCLDetCliExec() {
	var oGrid = dijit.byId("dgrCCLLista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una operaci&oacute;n.", "Advertencia", "W");
		return;
	}
	url = fGetURLPag("interface/ConClienteDet.html?compania="
			+ oItems[0].compania[0].id + "&companiaDes="
			+ oItems[0].compania[0].name + "&poliza=" + oItems[0].poliza
			+ "&endoso=" + oItems[0].endoso + "&tipoInforme=CCL&" + "&tipDoc="
			+ dijit.byId("cboCCLTipDoc").get("value") + "&nroDoc="
			+ dijit.byId("txtCCLNroDoc").get("value") + "&apellido="
			+ dijit.byId("txtCCLApeRaz").get("value") + "&companiaPar="
			+ dijit.byId("cboCCLCompania").get("value") + "&polizaPar="
			+ dijit.byId("txtCCLPoliza").get("value") + "&paramStart="
			+ document.getElementById("hidCCLParamStartAnt").value);
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onCCDLoad();
	});
}
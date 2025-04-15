function onCOELoad() {
	// Inicializar
	fCOEInitialize();
	// ReadOnly
	fCOEReadOnly(true);
	// Tomar parametro
	var vParFDe = fGetParamURL("fechaDesde");
	var vParFHa = fGetParamURL("fechaHasta");
	var vParCia = fGetParamURL("companiaPar");
	var vParPro = fGetParamURL("producto");
	var vParPSt = fGetParamURL("paramStart");
	if (vParFDe != "") {
		dijit.byId("txtCOEFecDes").set("value",
				fFormatDTB(vParFDe.substr(11, 8)));
		dijit.byId("txtCOEFecHas").set("value",
				fFormatDTB(vParFHa.substr(11, 8)));
		dijit.byId("cboCOECompania").set("value", vParCia.substr(12, 4), false);
		fCOECiaSel(dijit.byId("cboCOECompania").get("value"));
		dijit.byId("cboCOEProducto").set("value", vParPro.substr(9, 4));
		document.getElementById("hidCOEParamStart").value = vParPSt.substr(11,
				56);
		fSessionValidate('fCOEDataLoad');
	}
}

function fCOEInitialize() {
	// Resize
	fBrowserResize();
	// Fecha Hoy
	require(
			[ "dojo/request", "dojo/domReady!" ],
			function(request) {
				var vURL = fGetURLSvc("ParametersService/getFechaHoy");
				var deferred = request.get(vURL, {
					handleAs : "json",
					sync : true
				});
				deferred
						.then(
								function(response) {
									if (response.error) {
										vRet = false;
									} else {
										document
												.getElementById("hidCOEFechaHoy").value = response.result;
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
				fComboAllLoad(response, "cboCOECompania");
			}
		}, function(err) {
			vRet = false;
		});
	});
	// Setear valores
	dijit.byId("txtCOEFecDes").set(
			"value",
			fFormatDTB(fDateAdd(
					document.getElementById("hidCOEFechaHoy").value, -7)));
	dijit.byId("txtCOEFecHas").set("value",
			fFormatDTB(document.getElementById("hidCOEFechaHoy").value));
}

function fCOEReadOnly(value) {
	dijit.byId("btnCOEDetPol").set("disabled", value);
	dijit.byId("btnCOEDetCli").set("disabled", value);
	dijit.byId("btnCOEPagSig").set("disabled", value);
	dijit.byId("btnCOEExcel").set("disabled", value);
}

function fCOEClean() {
	fGridClean("dgrCOELista");
	dijit.byId("tpnCOELista").set("open", false);
}

function fCOEDataLoad() {
	// Espera
	fWaitMsgBoxIni("Consultando", [ "Consultando Informaci&oacute;n..." ]);

	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtCOEFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtCOEFecHas").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	document.getElementById("hidCOEParamStartAnt").value = document
			.getElementById("hidCOEParamStart").value;

	// Operaciones Emitidas
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var url = fGetURLSvc("BSService/getOpeEmitidaList?cache="
				+ fGetCacheRnd() + "&fechaDesde=" + vFecDes + "&fechaHasta="
				+ vFecHas + "&compania="
				+ dijit.byId("cboCOECompania").get("value") + "&producto="
				+ dijit.byId("cboCOEProducto").get("value") + "&paramStart="
				+ document.getElementById("hidCOEParamStart").value);
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

			var vJSON = response.result.opeEmitidaList;
			var vPStart = response.result.paramStart;
			document.getElementById("hidCOEParamStart").value = vPStart;

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
				width : "60px"
			}, {
				name : "Producto",
				field : "producto",
				width : "70px"
			}, {
				name : "P&oacute;liza",
				field : "poliza",
				width : "100px"
			}, {
				name : "End.",
				field : "endoso",
				width : "25px"
			}, {
				name : "Motivo",
				field : "motivo",
				width : "90px"
			}, {
				name : "Apellido / Nombre",
				field : "tomador",
				width : "100px"
			}, {
				name : "Vigencia Desde",
				field : "vigenciaDesde",
				formatter : fDgrColFec,
				width : "55px"
			}, {
				name : "Vigencia Hasta",
				field : "vigenciaHasta",
				formatter : fDgrColFec,
				width : "55px"
			}, {
				name : "Fecha Emisi&oacute;n",
				field : "fechaEmision",
				formatter : fDgrColFec,
				width : "55px"
			}, {
				name : "PNA",
				field : "prima",
				formatter : fDgrColDec,
				width : "50px",
				styles : 'text-align: right;'
			}, {
				name : "Precio 1er Recibo",
				field : "precio",
				formatter : fDgrColDec,
				width : "50px",
				styles : 'text-align: right;'
			} ] ];

			if (dijit.byId("dgrCOELista") == null) {
				oGrid = new DataGrid({
					id : "dgrCOELista",
					store : jsonDataSource,
					structure : layout,
					rowSelector : "25px",
					rowCount : 20,
					style : 'width: 890px; height: 230px;',
					selectionMode : "single"
				}, "_divCOELista");

				oGrid.startup();
			} else {
				dijit.byId("dgrCOELista").setStructure(layout);
				dijit.byId("dgrCOELista").setStore(jsonDataSource);
			}

			// Botones y paneles
			dijit.byId("tpnCOEParam").set("open", false);
			dijit.byId("tpnCOELista").set("open", true);
			fCOEReadOnly(false);
			if (vPStart == "") {
				dijit.byId("btnCOEPagSig").set("disabled", true);
			}

			// Mensaje de exito
			fWaitMsgBoxUpd(0, "Informe cargado.", "O");
			fWaitMsgBoxClose();
			dijit.byId("dlgWait").onCancel();

			dijit.byId("dgrCOELista").update();

			fMnuDeselect();
		}, function(err) {
			fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.", "E");
			fWaitMsgBoxClose();
		});
	});
}

function fCOECiaSel(value) {
	fComboClean("cboCOEProducto");

	if (value == "0") {
		dijit.byId("cboCOEProducto").set("disabled", true);
	} else {
		// Cargar Combo Productos
		require(
				[ "dojo/request", "dojo/domReady!" ],
				function(request) {

					var vURL = fGetURLSvc("ParametersService/getProductoList?compania="
							+ dijit.byId("cboCOECompania").get("value"));
					var deferred = request.get(vURL, {
						handleAs : "json",
						sync : true
					});

					deferred
							.then(
									function(response) {
										if (response.error
												|| response.result == null) {
											fMsgBox(
													"Se ha producido un error al consultar los productos.",
													"Error", "E");
										} else {
											fComboAllLoad(response,
													"cboCOEProducto", "TODOS",
													" ", true);
											dijit.byId("cboCOEProducto").set(
													"disabled", false);
										}
									},
									function(err) {
										fMsgBox(
												"Se ha producido un error al consultar los productos.",
												"Error", "E");
									});
				});
	}
}

function fCOEBuscar() {
	// ReadOnly y Clean
	fCOEReadOnly(true);
	fCOEClean();

	// Validacion
	if (dijit.byId("txtCOEFecDes").get("value") == null) {
		fMsgBox("Fecha desde inv&aacute;lida.", "Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("txtCOEFecHas").get("value") == null) {
		fMsgBox("Fecha hasta inv&aacute;lida.", "Validaci&oacute;n", "E");
		return;
	}

	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtCOEFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtCOEFecHas").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});

	// Rango
	if (vFecHas < vFecDes) {
		fMsgBox("La fecha hasta debe ser mayor o igual a la fecha desde.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (vFecHas > document.getElementById("hidCOEFechaHoy").value) {
		fMsgBox("La fecha hasta no debe ser mayor a la fecha actual.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (fDateAdd(vFecDes, 31) < vFecHas) {
		fMsgBox("El rango de fechas no debe superar los 31 d&iacute;as.",
				"Validaci&oacute;n", "E");
		return;
	}

	// Cargar Lista
	document.getElementById("hidCOEParamStart").value = "";
	document.getElementById("hidCOEParamStartAnt").value = "";
	fSessionValidate('fCOEDataLoad');
}

function fCOEPagSig() {
	fSessionValidate('fCOEDataLoad');
}

function fCOEExcel() {
	fSessionValidate('fCOEExcelExec');
}

function fCOEExcelExec() {
	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtCOEFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtCOEFecHas").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});

	window.open(fGetURLMVC("downloadSvc.html?tipoInforme=COE&fechaDesde="
			+ vFecDes + "&fechaHasta=" + vFecHas + "&compania="
			+ dijit.byId("cboCOECompania").get("value") + "&producto="
			+ dijit.byId("cboCOEProducto").get("value")), "download",
			"resizable=yes,height=65,width=150,top=50,left=100");
}

function fCOEDetPol() {
	fSessionValidate('fCOEDetPolExec');
}

function fCOEDetPolExec() {
	var oGrid = dijit.byId("dgrCOELista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una operaci&oacute;n.", "Advertencia", "W");
		return;
	}

	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtCOEFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtCOEFecHas").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});

	url = fGetURLPag("interface/ConPolizaDet.html?compania="
			+ oItems[0].compania[0].id + "&companiaDes="
			+ oItems[0].compania[0].name + "&poliza=" + oItems[0].poliza
			+ "&endoso=" + oItems[0].endoso + "&tipoInforme=COE&"
			+ "&fechaDesde=" + vFecDes + "&fechaHasta=" + vFecHas
			+ "&companiaPar=" + dijit.byId("cboCOECompania").get("value")
			+ "&producto=" + dijit.byId("cboCOEProducto").get("value")
			+ "&paramStart="
			+ document.getElementById("hidCOEParamStartAnt").value);
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onCPDLoad();
	});

}

function fCOEDetCli() {
	fSessionValidate('fCOEDetCliExec');
}

function fCOEDetCliExec() {
	var oGrid = dijit.byId("dgrCOELista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una operaci&oacute;n.", "Advertencia", "W");
		return;
	}

	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtCOEFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtCOEFecHas").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});

	url = fGetURLPag("interface/ConClienteDet.html?compania="
			+ oItems[0].compania[0].id + "&companiaDes="
			+ oItems[0].compania[0].name + "&poliza=" + oItems[0].poliza
			+ "&endoso=" + oItems[0].endoso + "&tipoInforme=COE&"
			+ "&fechaDesde=" + vFecDes + "&fechaHasta=" + vFecHas
			+ "&companiaPar=" + dijit.byId("cboCOECompania").get("value")
			+ "&producto=" + dijit.byId("cboCOEProducto").get("value")
			+ "&paramStart="
			+ document.getElementById("hidCOEParamStartAnt").value);
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onCCDLoad();
	});
}
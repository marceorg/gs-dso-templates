function onOSSLoad() {
	// Inicializar
	fOSSInitialize();
	// ReadOnly
	fOSSReadOnly(true);
	// Tomar parametro
	var vParFDe = fGetParamURL("fechaDesde");
	var vParFHa = fGetParamURL("fechaHasta");
	var vParApe = fGetParamURL("apellido");
	var vParTDo = fGetParamURL("tipDoc");
	var vParNDo = fGetParamURL("nroDoc");
	var vParOrd = fGetParamURL("ordenPar");
	var vParCia = fGetParamURL("compania");
	var vParPol = fGetParamURL("poliza");
	var vParEst = fGetParamURL("estado");
	var vParPSt = fGetParamURL("paramStart");
	if (vParTDo != "") {
		dijit.byId("txtOSSFecDes").set("value",
				fFormatDTB(vParFDe.substr(11, 8)));
		dijit.byId("txtOSSFecHas").set("value",
				fFormatDTB(vParFHa.substr(11, 8)));
		dijit.byId("txtOSSApeRaz").set("value", vParApe.substr(9, 30));
		dijit.byId("cboOSSTipDoc").set("value", vParTDo.substr(7, 2), false);
		fOSSTDoSel(dijit.byId("cboOSSTipDoc").get("value"));
		dijit.byId("txtOSSNroDoc").set("value", vParNDo.substr(7, 11));
		dijit.byId("txtOSSOrden").set("value", vParOrd.substr(9, 10));
		dijit.byId("cboOSSCompania").set("value", vParCia.substr(9, 4), false);
		fOSSCiaSel(dijit.byId("cboOSSCompania").get("value"));
		dijit.byId("txtOSSPoliza").set("value", vParPol.substr(7, 40));
		dijit.byId("cboOSSEstado").set("value", vParEst.substr(7, 1));
		document.getElementById("hidOSSParamStart").value = vParPSt.substr(11,
				70);
		fSessionValidate('fOSSDataLoad');
	}
}

function fOSSInitialize() {
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
												.getElementById("hidOSSFechaHoy").value = response.result;
									}
								}, function(err) {
									vRet = false;
								});
			});
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
				fComboAllLoad(response, "cboOSSTipDoc", "...", "0");
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
				fComboAllLoad(response, "cboOSSCompania", "...", "0");
			}
		}, function(err) {
			vRet = false;
		});
	});
	// Setear valores
	dijit.byId("txtOSSFecDes").set(
			"value",
			fFormatDTB(fDateAdd(
					document.getElementById("hidOSSFechaHoy").value, -365)));
	dijit.byId("txtOSSFecHas").set("value",
			fFormatDTB(document.getElementById("hidOSSFechaHoy").value));
}

function fOSSReadOnly(value) {
	dijit.byId("btnOSSDetSin").set("disabled", value);
	dijit.byId("btnOSSPagSig").set("disabled", value);
	dijit.byId("btnOSSExcel").set("disabled", value);
}

function fOSSClean() {
	fGridClean("dgrOSSLista");
	dijit.byId("tpnOSSLista").set("open", false);
}

function fOSSDataLoad() {
	// Espera
	fWaitMsgBoxIni("Consultando", [ "Consultando Informaci&oacute;n..." ]);

	// Determinar tipo de busqueda
	var vTipoBusqueda = "N";
	if (dijit.byId("cboOSSTipDoc").get("value") != 0) {
		vTipoBusqueda = "D";
	} else if (!isNaN(dijit.byId("txtOSSOrden").get("value"))) {
		vTipoBusqueda = "O";
	} else if (dijit.byId("cboOSSCompania").get("value") != 0) {
		if (String(dijit.byId("txtOSSPoliza").get("value")).length > 0) {
			vTipoBusqueda = "P";
		}
	}
	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtOSSFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtOSSFecHas").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	// Nro. de Orden
	var vOrden = 0;
	if (!isNaN(dijit.byId("txtOSSOrden").get("value"))) {
		vOrden = dijit.byId("txtOSSOrden").get("value");
	}
	document.getElementById("hidOSSParamStartAnt").value = document
			.getElementById("hidOSSParamStart").value;
	// Consulta Siniestros
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var url = fGetURLSvc("BSService/getOpeSiniestroList?cache="
				+ fGetCacheRnd() + "&tipoBusqueda=" + vTipoBusqueda
				+ "&tipDoc=" + dijit.byId("cboOSSTipDoc").get("value")
				+ "&nroDoc=" + dijit.byId("txtOSSNroDoc").get("value")
				+ "&apellido=" + dijit.byId("txtOSSApeRaz").get("value")
				+ "&poliza=" + dijit.byId("txtOSSPoliza").get("value")
				+ "&orden=" + vOrden + "&compania="
				+ dijit.byId("cboOSSCompania").get("value") + "&estado="
				+ dijit.byId("cboOSSEstado").get("value") + "&fechaDesde="
				+ vFecDes + "&fechaHasta=" + vFecHas + "&paramStart="
				+ document.getElementById("hidOSSParamStart").value);
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

			var vJSON = response.result.denunciaList;
			var vPStart = response.result.paramStart;
			document.getElementById("hidOSSParamStart").value = vPStart;

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
				name : "P&oacute;liza",
				field : "poliza",
				width : "200px"
			}, {
				name : "Apellido / Nombre",
				field : "tomador",
				width : "160px"
			}, {
				name : "Orden",
				field : "orden",
				width : "35px"
			}, {
				name : "Fecha",
				field : "fechaSiniestro",
				formatter : fDgrColFec,
				width : "55px"
			}, {
				name : "Estado",
				field : "estado",
				formatter : fDgrColEsD,
				width : "85px"
			} ] ];

			if (dijit.byId("dgrOSSLista") == null) {
				oGrid = new DataGrid({
					id : "dgrOSSLista",
					store : jsonDataSource,
					structure : layout,
					rowSelector : "25px",
					rowCount : 20,
					style : 'width: 890px; height: 230px;',
					selectionMode : "single"
				}, "_divOSSLista");

				oGrid.startup();
			} else {
				dijit.byId("dgrOSSLista").setStructure(layout);
				dijit.byId("dgrOSSLista").setStore(jsonDataSource);
			}

			// Botones y paneles
			dijit.byId("tpnOSSParam").set("open", false);
			dijit.byId("tpnOSSLista").set("open", true);
			fOSSReadOnly(false);
			if (vPStart == "") {
				dijit.byId("btnOSSPagSig").set("disabled", true);
			}

			// Mensaje de exito
			fWaitMsgBoxUpd(0, "Informe cargado.", "O");
			fWaitMsgBoxClose();
			dijit.byId("dlgWait").onCancel();

			dijit.byId("dgrOSSLista").update();

			fMnuDeselect();
		}, function(err) {
			fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.", "E");
			fWaitMsgBoxClose();
		});
	});
}

function fOSSTDoSel(value) {
	dijit.byId("txtOSSNroDoc").set("value", "");
	if (value == "0") {
		dijit.byId("txtOSSNroDoc").set("disabled", true);
	} else {
		dijit.byId("txtOSSNroDoc").set("disabled", false);
	}
}

function fOSSCiaSel(value) {
	dijit.byId("txtOSSPoliza").set("value", "");
	document.getElementById("lblOSSPolEjemplo").innerHTML = "";
	if (value == "0") {
		dijit.byId("txtOSSPoliza").set("disabled", true);
	} else {
		dijit.byId("txtOSSPoliza").set("disabled", false);
		// Se determina por compania el ejemplo de poliza a mostrar (formato)
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
												.byId("cboOSSCompania").get(
														"value")) {
											document
													.getElementById("lblOSSPolEjemplo").innerHTML = response.result[i].ejePoliza;
											break;
										}
									}
								}
							});
				});
	}
}

function fOSSBuscar() {
	// ReadOnly y Clean
	fOSSReadOnly(true);
	fOSSClean();

	// Validacion Fechas
	if (dijit.byId("txtOSSFecDes").get("value") == null) {
		fMsgBox("Fecha desde inv&aacute;lida.", "Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("txtOSSFecHas").get("value") == null) {
		fMsgBox("Fecha hasta inv&aacute;lida.", "Validaci&oacute;n", "E");
		return;
	}

	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtOSSFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtOSSFecHas").get(
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
	if (vFecHas > document.getElementById("hidOSSFechaHoy").value) {
		fMsgBox("La fecha hasta no debe ser mayor a la fecha actual.",
				"Validaci&oacute;n", "E");
		return;
	}

	// Validacion
	if (String(dijit.byId("txtOSSApeRaz").get("value")).length == 0
			&& dijit.byId("cboOSSTipDoc").get("value") == 0
			&& dijit.byId("cboOSSCompania").get("value") == 0
			&& isNaN(dijit.byId("txtOSSOrden").get("value"))) {
		fMsgBox(
				"Debe ingresar alg&uacute;n par&aacute;metro adem&aacute;s de las fechas y el estado.",
				"Validaci&oacute;n", "E");
		return;
	}
	if ((String(dijit.byId("txtOSSApeRaz").get("value")).length > 0 && dijit
			.byId("cboOSSTipDoc").get("value") != 0)
			|| (String(dijit.byId("txtOSSApeRaz").get("value")).length > 0 && dijit
					.byId("cboOSSCompania").get("value") != 0)
			|| (String(dijit.byId("txtOSSApeRaz").get("value")).length > 0 && !isNaN(dijit
					.byId("txtOSSOrden").get("value")))
			|| (dijit.byId("cboOSSTipDoc").get("value") != 0 && dijit.byId(
					"cboOSSCompania").get("value") != 0)
			|| (dijit.byId("cboOSSTipDoc").get("value") != 0 && !isNaN(dijit
					.byId("txtOSSOrden").get("value")))
			|| (dijit.byId("cboOSSCompania").get("value") != 0 && !isNaN(dijit
					.byId("txtOSSOrden").get("value")))) {
		fMsgBox("Debe buscar por un solo par&aacute;metro.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("cboOSSTipDoc").get("value") != 0
			&& String(dijit.byId("txtOSSNroDoc").get("value")).length == 0) {
		fMsgBox("Debe ingresar un n&uacute;mero de documento.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("txtOSSOrden").get("value") == 0) {
		fMsgBox("No puede ingresar Nro. de Orden en cero.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("cboOSSCompania").get("value") != 0) {
		if (String(dijit.byId("txtOSSPoliza").get("value")).length == 0) {
			fMsgBox(
					"Debe ingresar la p&oacute;liza para la compa&ntilde;&iacute;a seleccionada.",
					"Validaci&oacute;n", "E");
			return;
		}
	}

	// Cargar Lista
	document.getElementById("hidOSSParamStart").value = "";
	document.getElementById("hidOSSParamStartAnt").value = "";
	fSessionValidate('fOSSDataLoad');
}

function fOSSPagSig() {
	fSessionValidate('fOSSDataLoad');
}

function fOSSExcel() {
	fSessionValidate('fOSSExcelExec');
}

function fOSSExcelExec() {
	// Determinar tipo de busqueda
	var vTipoBusqueda = "N";
	if (dijit.byId("cboOSSTipDoc").get("value") != 0) {
		vTipoBusqueda = "D";
	} else if (!isNaN(dijit.byId("txtOSSOrden").get("value"))) {
		vTipoBusqueda = "O";
	} else if (dijit.byId("cboOSSCompania").get("value") != 0) {
		if (String(dijit.byId("txtOSSPoliza").get("value")).length > 0) {
			vTipoBusqueda = "P";
		}
	}
	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtOSSFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtOSSFecHas").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	// Nro. de Orden
	var vOrden = 0;
	if (!isNaN(dijit.byId("txtOSSOrden").get("value"))) {
		vOrden = dijit.byId("txtOSSOrden").get("value");
	}
	window.open(fGetURLMVC("downloadSvc.html?tipoInforme=OSS&"
			+ "tipoBusqueda=" + vTipoBusqueda + "&tipDoc="
			+ dijit.byId("cboOSSTipDoc").get("value") + "&nroDoc="
			+ dijit.byId("txtOSSNroDoc").get("value") + "&apellido="
			+ dijit.byId("txtOSSApeRaz").get("value") + "&poliza="
			+ dijit.byId("txtOSSPoliza").get("value") + "&orden=" + vOrden
			+ "&compania=" + dijit.byId("cboOSSCompania").get("value")
			+ "&estado=" + dijit.byId("cboOSSEstado").get("value")
			+ "&fechaDesde=" + vFecDes + "&fechaHasta=" + vFecHas), "download",
			"resizable=yes,height=65,width=150,top=50,left=100");
}

function fOSSDetSin() {
	fSessionValidate('fOSSDetSinExec');
}

function fOSSDetSinExec() {
	var oGrid = dijit.byId("dgrOSSLista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una operaci&oacute;n.", "Advertencia", "W");
		return;
	}
	if (oItems[0].estado == "A") {
		fMsgBox("No se puede ver el detalle de una operaci&oacute;n ANULADA.",
				"Advertencia", "W");
		return;
	}
	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtOSSFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtOSSFecHas").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	// Nro. de Orden
	var vOrden = "";
	if (!isNaN(dijit.byId("txtOSSOrden").get("value"))) {
		vOrden = dijit.byId("txtOSSOrden").get("value");
	}
	url = fGetURLPag("interface/OpeSiniestroDet.html?orden=" + oItems[0].orden
			+ "&tipoInforme=OSS&" + "&tipDoc="
			+ dijit.byId("cboOSSTipDoc").get("value") + "&nroDoc="
			+ dijit.byId("txtOSSNroDoc").get("value") + "&apellido="
			+ dijit.byId("txtOSSApeRaz").get("value") + "&compania="
			+ dijit.byId("cboOSSCompania").get("value") + "&poliza="
			+ dijit.byId("txtOSSPoliza").get("value") + "&ordenPar=" + vOrden
			+ "&estado=" + dijit.byId("cboOSSEstado").get("value")
			+ "&fechaDesde=" + vFecDes + "&fechaHasta=" + vFecHas
			+ "&paramStart="
			+ document.getElementById("hidOSSParamStartAnt").value);
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onOSDLoad();
	});
}
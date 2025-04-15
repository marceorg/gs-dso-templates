function onCSILoad() {
	// Inicializar
	fCSIInitialize();
	// ReadOnly
	fCSIReadOnly(true);
	// Tomar parametro
	var vParFDe = fGetParamURL("fechaDesde");
	var vParFHa = fGetParamURL("fechaHasta");
	var vParApe = fGetParamURL("apellido");
	var vParTDo = fGetParamURL("tipDoc");
	var vParNDo = fGetParamURL("nroDoc");
	var vParOrd = fGetParamURL("orden");
	var vParCia = fGetParamURL("companiaPar");
	var vParPol = fGetParamURL("poliza");
	var vParSin = fGetParamURL("siniestroPar");
	var vParEst = fGetParamURL("estado");
	var vParPSt = fGetParamURL("paramStart");
	if (vParTDo != "") {
		dijit.byId("txtCSIFecDes").set("value",
				fFormatDTB(vParFDe.substr(11, 8)));
		dijit.byId("txtCSIFecHas").set("value",
				fFormatDTB(vParFHa.substr(11, 8)));
		dijit.byId("txtCSIApeRaz").set("value", vParApe.substr(9, 30));
		dijit.byId("cboCSITipDoc").set("value", vParTDo.substr(7, 2), false);
		fCSITDoSel(dijit.byId("cboCSITipDoc").get("value"));
		dijit.byId("txtCSINroDoc").set("value", vParNDo.substr(7, 11));
		dijit.byId("txtCSIOrden").set("value", vParOrd.substr(6, 10));
		dijit.byId("cboCSICompania").set("value", vParCia.substr(12, 4), false);
		fCSICiaSel(dijit.byId("cboCSICompania").get("value"));
		dijit.byId("txtCSIPoliza").set("value", vParPol.substr(7, 40));
		dijit.byId("txtCSISiniestro").set("value", vParSin.substr(13, 30));
		dijit.byId("cboCSIEstado").set("value", vParEst.substr(7, 1));
		document.getElementById("hidCSIParamStart").value = vParPSt.substr(11,
				70);
		fSessionValidate('fCSIDataLoad');
	}
}

function fCSIInitialize() {
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
												.getElementById("hidCSIFechaHoy").value = response.result;
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
				fComboAllLoad(response, "cboCSITipDoc", "...", "0");
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
				fComboAllLoad(response, "cboCSICompania", "...", "0");
			}
		}, function(err) {
			vRet = false;
		});
	});
	// Cargar Combo Estados
	require([ "dojo/request", "dojo/domReady!" ], function(request) {

		var vURL = fGetURLSvc("ParametersService/getSinEstadoList");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});

		deferred.then(function(response) {
			if (response.error) {
				vRet = false;
			} else {
				fComboAllLoad(response, "cboCSIEstado", "...", "0");
			}
		}, function(err) {
			vRet = false;
		});
	});
	// Setear valores
	dijit.byId("txtCSIFecDes").set(
			"value",
			fFormatDTB(fDateAdd(
					document.getElementById("hidCSIFechaHoy").value, -365)));
	dijit.byId("txtCSIFecHas").set("value",
			fFormatDTB(document.getElementById("hidCSIFechaHoy").value));
}

function fCSIReadOnly(value) {
	dijit.byId("btnCSIDetSin").set("disabled", value);
	dijit.byId("btnCSIPagSig").set("disabled", value);
	dijit.byId("btnCSIExcel").set("disabled", value);
}

function fCSIClean() {
	fGridClean("dgrCSILista");
	dijit.byId("tpnCSILista").set("open", false);
}

function fCSIDataLoad() {
	// Espera
	fWaitMsgBoxIni("Consultando", [ "Consultando Informaci&oacute;n..." ]);

	// Determinar tipo de busqueda
	var vTipoBusqueda = "N";
	if (dijit.byId("cboCSITipDoc").get("value") != 0) {
		vTipoBusqueda = "D";
	} else if (!isNaN(dijit.byId("txtCSIOrden").get("value"))) {
		vTipoBusqueda = "O";
	} else if (dijit.byId("cboCSICompania").get("value") != 0) {
		if (String(dijit.byId("txtCSIPoliza").get("value")).length > 0) {
			vTipoBusqueda = "P";
		} else if (String(dijit.byId("txtCSISiniestro").get("value")).length > 0) {
			vTipoBusqueda = "S";
		} else if (dijit.byId("cboCSIEstado").get("value") != 0) {
			vTipoBusqueda = "E";
		}
	}
	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtCSIFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtCSIFecHas").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	// Nro. de Orden
	var vOrden = 0;
	if (!isNaN(dijit.byId("txtCSIOrden").get("value"))) {
		vOrden = dijit.byId("txtCSIOrden").get("value");
	}
	document.getElementById("hidCSIParamStartAnt").value = document
			.getElementById("hidCSIParamStart").value;
	// Consulta Siniestros
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var url = fGetURLSvc("BSService/getConSiniestroList?cache="
				+ fGetCacheRnd() + "&tipoBusqueda=" + vTipoBusqueda
				+ "&tipDoc=" + dijit.byId("cboCSITipDoc").get("value")
				+ "&nroDoc=" + dijit.byId("txtCSINroDoc").get("value")
				+ "&apellido=" + dijit.byId("txtCSIApeRaz").get("value")
				+ "&poliza=" + dijit.byId("txtCSIPoliza").get("value")
				+ "&siniestro=" + dijit.byId("txtCSISiniestro").get("value")
				+ "&orden=" + vOrden + "&compania="
				+ dijit.byId("cboCSICompania").get("value") + "&estado="
				+ dijit.byId("cboCSIEstado").get("value") + "&fechaDesde="
				+ vFecDes + "&fechaHasta=" + vFecHas + "&paramStart="
				+ document.getElementById("hidCSIParamStart").value);
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

			var vJSON = response.result.conSiniestroList;
			var vPStart = response.result.paramStart;
			document.getElementById("hidCSIParamStart").value = vPStart;

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
				name : "Siniestro",
				field : "siniestro",
				width : "125px"
			}, {
				name : "Fecha",
				field : "fechaSiniestro",
				formatter : fDgrColFec,
				width : "55px"
			}, {
				name : "Estado",
				field : "estado",
				width : "85px"
			} ] ];

			if (dijit.byId("dgrCSILista") == null) {
				oGrid = new DataGrid({
					id : "dgrCSILista",
					store : jsonDataSource,
					structure : layout,
					rowSelector : "25px",
					rowCount : 20,
					style : 'width: 890px; height: 230px;',
					selectionMode : "single"
				}, "_divCSILista");

				oGrid.startup();
			} else {
				dijit.byId("dgrCSILista").setStructure(layout);
				dijit.byId("dgrCSILista").setStore(jsonDataSource);
			}

			// Botones y paneles
			dijit.byId("tpnCSIParam").set("open", false);
			dijit.byId("tpnCSILista").set("open", true);
			fCSIReadOnly(false);
			if (vPStart == "") {
				dijit.byId("btnCSIPagSig").set("disabled", true);
			}

			// Mensaje de exito
			fWaitMsgBoxUpd(0, "Informe cargado.", "O");
			fWaitMsgBoxClose();
			dijit.byId("dlgWait").onCancel();

			dijit.byId("dgrCSILista").update();

			fMnuDeselect();
		}, function(err) {
			fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.", "E");
			fWaitMsgBoxClose();
		});
	});
}

function fCSITDoSel(value) {
	dijit.byId("txtCSINroDoc").set("value", "");
	if (value == "0") {
		dijit.byId("txtCSINroDoc").set("disabled", true);
	} else {
		dijit.byId("txtCSINroDoc").set("disabled", false);
	}
}

function fCSICiaSel(value) {
	dijit.byId("txtCSIPoliza").set("value", "");
	dijit.byId("txtCSISiniestro").set("value", "");
	dijit.byId("cboCSIEstado").set("value", "0");
	document.getElementById("lblCSIPolEjemplo").innerHTML = "";
	document.getElementById("lblCSISinEjemplo").innerHTML = "";
	if (value == "0") {
		dijit.byId("txtCSIPoliza").set("disabled", true);
		dijit.byId("txtCSISiniestro").set("disabled", true);
		dijit.byId("cboCSIEstado").set("disabled", true);
	} else {
		dijit.byId("txtCSIPoliza").set("disabled", false);
		dijit.byId("txtCSISiniestro").set("disabled", false);
		dijit.byId("cboCSIEstado").set("disabled", false);
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
												.byId("cboCSICompania").get(
														"value")) {
											document
													.getElementById("lblCSIPolEjemplo").innerHTML = response.result[i].ejePoliza;
											document
													.getElementById("lblCSISinEjemplo").innerHTML = response.result[i].ejeSiniestro;
											break;
										}
									}
								}
							});
				});
	}
}

function fCSIBuscar() {
	// ReadOnly y Clean
	fCSIReadOnly(true);
	fCSIClean();

	// Validacion Fechas
	if (dijit.byId("txtCSIFecDes").get("value") == null) {
		fMsgBox("Fecha desde inv&aacute;lida.", "Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("txtCSIFecHas").get("value") == null) {
		fMsgBox("Fecha hasta inv&aacute;lida.", "Validaci&oacute;n", "E");
		return;
	}

	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtCSIFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtCSIFecHas").get(
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
	if (vFecHas > document.getElementById("hidCSIFechaHoy").value) {
		fMsgBox("La fecha hasta no debe ser mayor a la fecha actual.",
				"Validaci&oacute;n", "E");
		return;
	}

	// Validacion
	if (String(dijit.byId("txtCSIApeRaz").get("value")).length == 0
			&& dijit.byId("cboCSITipDoc").get("value") == 0
			&& dijit.byId("cboCSICompania").get("value") == 0
			&& isNaN(dijit.byId("txtCSIOrden").get("value"))) {
		fMsgBox(
				"Debe ingresar alg&uacute;n par&aacute;metro adem&aacute;s de las fechas.",
				"Validaci&oacute;n", "E");
		return;
	}
	if ((String(dijit.byId("txtCSIApeRaz").get("value")).length > 0 && dijit
			.byId("cboCSITipDoc").get("value") != 0)
			|| (String(dijit.byId("txtCSIApeRaz").get("value")).length > 0 && dijit
					.byId("cboCSICompania").get("value") != 0)
			|| (String(dijit.byId("txtCSIApeRaz").get("value")).length > 0 && !isNaN(dijit
					.byId("txtCSIOrden").get("value")))
			|| (dijit.byId("cboCSITipDoc").get("value") != 0 && dijit.byId(
					"cboCSICompania").get("value") != 0)
			|| (dijit.byId("cboCSITipDoc").get("value") != 0 && !isNaN(dijit
					.byId("txtCSIOrden").get("value")))
			|| (dijit.byId("cboCSICompania").get("value") != 0 && !isNaN(dijit
					.byId("txtCSIOrden").get("value")))) {
		fMsgBox("Debe buscar por un solo par&aacute;metro.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("cboCSITipDoc").get("value") != 0
			&& String(dijit.byId("txtCSINroDoc").get("value")).length == 0) {
		fMsgBox("Debe ingresar un n&uacute;mero de documento.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("txtCSIOrden").get("value") == 0) {
		fMsgBox("No puede ingresar Nro. de Orden en cero.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("cboCSICompania").get("value") != 0) {
		if (String(dijit.byId("txtCSIPoliza").get("value")).length == 0
				&& String(dijit.byId("txtCSISiniestro").get("value")).length == 0
				&& dijit.byId("cboCSIEstado").get("value") == 0) {
			fMsgBox(
					"Debe ingresar un par&aacute;metro para la compa&ntilde;&iacute;a seleccionada.",
					"Validaci&oacute;n", "E");
			return;
		}
		if ((String(dijit.byId("txtCSIPoliza").get("value")).length > 0 && String(dijit
				.byId("txtCSISiniestro").get("value")).length > 0)
				|| (String(dijit.byId("txtCSIPoliza").get("value")).length > 0 && dijit
						.byId("cboCSIEstado").get("value") != "0")
				|| (String(dijit.byId("txtCSISiniestro").get("value")).length > 0 && dijit
						.byId("cboCSIEstado").get("value") != "0")) {
			fMsgBox(
					"Debe ingresar un solo par&aacute;metro para la compa&ntilde;&iacute;a seleccionada.",
					"Validaci&oacute;n", "E");
			return;
		}
	}

	// Cargar Lista
	document.getElementById("hidCSIParamStart").value = "";
	document.getElementById("hidCSIParamStartAnt").value = "";
	fSessionValidate('fCSIDataLoad');
}

function fCSIPagSig() {
	fSessionValidate('fCSIDataLoad');
}

function fCSIExcel() {
	fSessionValidate('fCSIExcelExec');
}

function fCSIExcelExec() {
	// Determinar tipo de busqueda
	var vTipoBusqueda = "N";
	if (dijit.byId("cboCSITipDoc").get("value") != 0) {
		vTipoBusqueda = "D";
	} else if (!isNaN(dijit.byId("txtCSIOrden").get("value"))) {
		vTipoBusqueda = "O";
	} else if (dijit.byId("cboCSICompania").get("value") != 0) {
		if (String(dijit.byId("txtCSIPoliza").get("value")).length > 0) {
			vTipoBusqueda = "P";
		} else if (String(dijit.byId("txtCSISiniestro").get("value")).length > 0) {
			vTipoBusqueda = "S";
		} else if (dijit.byId("cboCSIEstado").get("value") != 0) {
			vTipoBusqueda = "E";
		}
	}
	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtCSIFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtCSIFecHas").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	// Nro. de Orden
	var vOrden = 0;
	if (!isNaN(dijit.byId("txtCSIOrden").get("value"))) {
		vOrden = dijit.byId("txtCSIOrden").get("value");
	}
	window.open(fGetURLMVC("downloadSvc.html?tipoInforme=CSI&"
			+ "tipoBusqueda=" + vTipoBusqueda + "&tipDoc="
			+ dijit.byId("cboCSITipDoc").get("value") + "&nroDoc="
			+ dijit.byId("txtCSINroDoc").get("value") + "&apellido="
			+ dijit.byId("txtCSIApeRaz").get("value") + "&poliza="
			+ dijit.byId("txtCSIPoliza").get("value") + "&siniestro="
			+ dijit.byId("txtCSISiniestro").get("value") + "&orden=" + vOrden
			+ "&compania=" + dijit.byId("cboCSICompania").get("value")
			+ "&estado=" + dijit.byId("cboCSIEstado").get("value")
			+ "&fechaDesde=" + vFecDes + "&fechaHasta=" + vFecHas), "download",
			"resizable=yes,height=65,width=150,top=50,left=100");
}

function fCSIDetSin() {
	fSessionValidate('fCSIDetSinExec');
}

function fCSIDetSinExec() {
	var oGrid = dijit.byId("dgrCSILista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una operaci&oacute;n.", "Advertencia", "W");
		return;
	}
	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtCSIFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtCSIFecHas").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	// Nro. de Orden
	var vOrden = "";
	if (!isNaN(dijit.byId("txtCSIOrden").get("value"))) {
		vOrden = dijit.byId("txtCSIOrden").get("value");
	}
	url = fGetURLPag("interface/ConSiniestroDet.html?compania="
			+ oItems[0].compania[0].id + "&companiaDes="
			+ oItems[0].compania[0].name + "&siniestro=" + oItems[0].siniestro
			+ "&tipoInforme=CSI&" + "&tipDoc="
			+ dijit.byId("cboCSITipDoc").get("value") + "&nroDoc="
			+ dijit.byId("txtCSINroDoc").get("value") + "&apellido="
			+ dijit.byId("txtCSIApeRaz").get("value") + "&companiaPar="
			+ dijit.byId("cboCSICompania").get("value") + "&poliza="
			+ dijit.byId("txtCSIPoliza").get("value") + "&siniestroPar="
			+ dijit.byId("txtCSISiniestro").get("value") + "&orden=" + vOrden
			+ "&estado=" + dijit.byId("cboCSIEstado").get("value")
			+ "&fechaDesde=" + vFecDes + "&fechaHasta=" + vFecHas
			+ "&paramStart="
			+ document.getElementById("hidCSIParamStartAnt").value);
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onCSDLoad();
	});
}
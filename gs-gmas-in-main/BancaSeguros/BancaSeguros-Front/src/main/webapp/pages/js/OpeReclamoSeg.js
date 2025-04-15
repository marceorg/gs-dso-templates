function onORSLoad() {
	// Inicializar
	fORSInitialize();
	// ReadOnly
	fORSReadOnly(true);
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
		dijit.byId("txtORSFecDes").set("value",
				fFormatDTB(vParFDe.substr(11, 8)));
		dijit.byId("txtORSFecHas").set("value",
				fFormatDTB(vParFHa.substr(11, 8)));
		dijit.byId("txtORSApeRaz").set("value", vParApe.substr(9, 30));
		dijit.byId("cboORSTipDoc").set("value", vParTDo.substr(7, 2), false);
		fORSTDoSel(dijit.byId("cboORSTipDoc").get("value"));
		dijit.byId("txtORSNroDoc").set("value", vParNDo.substr(7, 11));
		dijit.byId("txtORSOrden").set("value", vParOrd.substr(9, 10));
		dijit.byId("cboORSCompania").set("value", vParCia.substr(9, 4), false);
		fORSCiaSel(dijit.byId("cboORSCompania").get("value"));
		dijit.byId("txtORSPoliza").set("value", vParPol.substr(7, 40));
		dijit.byId("cboORSEstado").set("value", vParEst.substr(7, 1));
		document.getElementById("hidORSParamStart").value = vParPSt.substr(11,
				70);
		fSessionValidate('fORSDataLoad');
	}
}

function fORSInitialize() {
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
												.getElementById("hidORSFechaHoy").value = response.result;
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
				fComboAllLoad(response, "cboORSTipDoc", "...", "0");
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
				fComboAllLoad(response, "cboORSCompania", "...", "0");
			}
		}, function(err) {
			vRet = false;
		});
	});
	// Setear valores
	dijit.byId("txtORSFecDes").set(
			"value",
			fFormatDTB(fDateAdd(
					document.getElementById("hidORSFechaHoy").value, -365)));
	dijit.byId("txtORSFecHas").set("value",
			fFormatDTB(document.getElementById("hidORSFechaHoy").value));
}

function fORSReadOnly(value) {
	dijit.byId("btnORSDetRec").set("disabled", value);
	dijit.byId("btnORSPagSig").set("disabled", value);
}

function fORSClean() {
	fGridClean("dgrORSLista");
	dijit.byId("tpnORSLista").set("open", false);
}

function fORSDataLoad() {
	// Espera
	fWaitMsgBoxIni("Consultando", [ "Consultando Informaci&oacute;n..." ]);

	// Determinar tipo de busqueda
	var vTipoBusqueda = "N";
	if (dijit.byId("cboORSTipDoc").get("value") != 0) {
		vTipoBusqueda = "D";
	} else if (!isNaN(dijit.byId("txtORSOrden").get("value"))) {
		vTipoBusqueda = "O";
	} else if (dijit.byId("cboORSCompania").get("value") != 0) {
		if (String(dijit.byId("txtORSPoliza").get("value")).length > 0) {
			vTipoBusqueda = "P";
		}
	}
	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtORSFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtORSFecHas").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	// Nro. de Orden
	var vOrden = 0;
	if (!isNaN(dijit.byId("txtORSOrden").get("value"))) {
		vOrden = dijit.byId("txtORSOrden").get("value");
	}
	document.getElementById("hidORSParamStartAnt").value = document
			.getElementById("hidORSParamStart").value;
	// Consulta Reclamos
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var url = fGetURLSvc("BSService/getOpeReclamoList?cache="
				+ fGetCacheRnd() + "&tipoBusqueda=" + vTipoBusqueda
				+ "&tipDoc=" + dijit.byId("cboORSTipDoc").get("value")
				+ "&nroDoc=" + dijit.byId("txtORSNroDoc").get("value")
				+ "&apellido=" + fEncodeURI(dijit.byId("txtORSApeRaz").get("value"))
				+ "&poliza=" + dijit.byId("txtORSPoliza").get("value")
				+ "&orden=" + vOrden + "&compania="
				+ dijit.byId("cboORSCompania").get("value") + "&estado="
				+ dijit.byId("cboORSEstado").get("value") + "&fechaDesde="
				+ vFecDes + "&fechaHasta=" + vFecHas + "&paramStart="
				+ document.getElementById("hidORSParamStart").value);
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
			var vJSONDat = response.result;
			var vPStart = response.result.paramStart;
			document.getElementById("hidORSParamStart").value = vPStart;

			// Si no trae nada
			if (vJSONDat == null || !vJSONDat.jsonResult) {
				fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.",
						"E");
				fWaitMsgBoxClose();
				return;
			}

			var vJSONRec = fJSONParse(vJSONDat.jsonResult);

			if (vJSONRec == null || vJSONRec.CANT == "0"
					|| vJSONRec.REGS.REG.length == 0) {
				fWaitMsgBoxUpd(0,
						"No se encontr&oacute; ning&uacute;n registro.", "W");
				fWaitMsgBoxClose();
				return;
			}

			// Listado
			var vData = {
				items : vJSONRec.REGS.REG
			};
			var jsonDataSource = new ItemFileWriteStore({
				data : vData
			});

			var layout = [ [ {
				name : "Compa&ntilde;&iacute;a",
				field : "CIAASCODS",
				formatter : fDgrColCia,
				width : "100px"
			}, {
				name : "P&oacute;liza",
				field : "POLIZAS",
				width : "200px"
			}, {
				name : "Apellido / Nombre",
				field : "APEYNOMS",
				width : "160px"
			}, {
				name : "Orden",
				field : "ORDENS",
				width : "35px"
			}, {
				name : "Fecha",
				field : "FECHAR",
				formatter : fDgrColFec,
				width : "55px"
			}, {
				name : "Estado",
				field : "ESTADOS",
				formatter : fDgrColEsD,
				width : "85px"
			} ] ];

			if (dijit.byId("dgrORSLista") == null) {
				oGrid = new DataGrid({
					id : "dgrORSLista",
					store : jsonDataSource,
					structure : layout,
					rowSelector : "25px",
					rowCount : 20,
					style : 'width: 890px; height: 230px;',
					selectionMode : "single"
				}, "_divORSLista");

				oGrid.startup();
			} else {
				dijit.byId("dgrORSLista").setStructure(layout);
				dijit.byId("dgrORSLista").setStore(jsonDataSource);
			}

			// Botones y paneles
			dijit.byId("tpnORSParam").set("open", false);
			dijit.byId("tpnORSLista").set("open", true);
			fORSReadOnly(false);
			if (vPStart == "") {
				dijit.byId("btnORSPagSig").set("disabled", true);
			}

			// Mensaje de exito
			fWaitMsgBoxUpd(0, "Informe cargado.", "O");
			fWaitMsgBoxClose();
			dijit.byId("dlgWait").onCancel();

			dijit.byId("dgrORSLista").update();

			fMnuDeselect();
		}, function(err) {
			fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.", "E");
			fWaitMsgBoxClose();
		});
	});
}

function fDgrColCia(value) {
	return fNomCia(value);
}

function fNomCia(vNroCia) {
	var vNomCia = "";
	require([ "dojo/request", "dojo/domReady!" ], function(request) {

		var vURL = fGetURLSvc("ParametersService/getCompaniaList");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});

		deferred.then(function(response) {
			if (!response.error) {
				for ( var i in response.result) {
					if (String(response.result[i].id) == vNroCia) {
						vNomCia = response.result[i].name;
						break;
					}
				}
			}
		});
	});
	return vNomCia;
}

function fORSTDoSel(value) {
	dijit.byId("txtORSNroDoc").set("value", "");
	if (value == "0") {
		dijit.byId("txtORSNroDoc").set("disabled", true);
	} else {
		dijit.byId("txtORSNroDoc").set("disabled", false);
	}
}

function fORSCiaSel(value) {
	dijit.byId("txtORSPoliza").set("value", "");
	document.getElementById("lblORSPolEjemplo").innerHTML = "";
	if (value == "0") {
		dijit.byId("txtORSPoliza").set("disabled", true);
	} else {
		dijit.byId("txtORSPoliza").set("disabled", false);
		// Se determina por cia el ejemplo de poliza a mostrar (formato)
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
												.byId("cboORSCompania").get(
														"value")) {
											document
													.getElementById("lblORSPolEjemplo").innerHTML = response.result[i].ejePoliza;
											break;
										}
									}
								}
							});
				});
	}
}

function fORSBuscar() {
	// ReadOnly y Clean
	fORSReadOnly(true);
	fORSClean();

	// Validacion Fechas
	if (dijit.byId("txtORSFecDes").get("value") == null) {
		fMsgBox("Fecha desde inv&aacute;lida.", "Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("txtORSFecHas").get("value") == null) {
		fMsgBox("Fecha hasta inv&aacute;lida.", "Validaci&oacute;n", "E");
		return;
	}

	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtORSFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtORSFecHas").get(
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
	if (vFecHas > document.getElementById("hidORSFechaHoy").value) {
		fMsgBox("La fecha hasta no debe ser mayor a la fecha actual.",
				"Validaci&oacute;n", "E");
		return;
	}

	// Validacion
	if (String(dijit.byId("txtORSApeRaz").get("value")).length == 0
			&& dijit.byId("cboORSTipDoc").get("value") == 0
			&& dijit.byId("cboORSCompania").get("value") == 0
			&& isNaN(dijit.byId("txtORSOrden").get("value"))) {
		fMsgBox(
				"Debe ingresar alg&uacute;n par&aacute;metro adem&aacute;s de las fechas y el estado.",
				"Validaci&oacute;n", "E");
		return;
	}
	if ((String(dijit.byId("txtORSApeRaz").get("value")).length > 0 && dijit
			.byId("cboORSTipDoc").get("value") != 0)
			|| (String(dijit.byId("txtORSApeRaz").get("value")).length > 0 && dijit
					.byId("cboORSCompania").get("value") != 0)
			|| (String(dijit.byId("txtORSApeRaz").get("value")).length > 0 && !isNaN(dijit
					.byId("txtORSOrden").get("value")))
			|| (dijit.byId("cboORSTipDoc").get("value") != 0 && dijit.byId(
					"cboORSCompania").get("value") != 0)
			|| (dijit.byId("cboORSTipDoc").get("value") != 0 && !isNaN(dijit
					.byId("txtORSOrden").get("value")))
			|| (dijit.byId("cboORSCompania").get("value") != 0 && !isNaN(dijit
					.byId("txtORSOrden").get("value")))) {
		fMsgBox("Debe buscar por un solo par&aacute;metro.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("cboORSTipDoc").get("value") != 0
			&& String(dijit.byId("txtORSNroDoc").get("value")).length == 0) {
		fMsgBox("Debe ingresar un n&uacute;mero de documento.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("txtORSOrden").get("value") == 0) {
		fMsgBox("No puede ingresar Nro. de Orden en cero.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("cboORSCompania").get("value") != 0) {
		if (String(dijit.byId("txtORSPoliza").get("value")).length == 0) {
			fMsgBox(
					"Debe ingresar la p&oacute;liza para la compa&ntilde;&iacute;a seleccionada.",
					"Validaci&oacute;n", "E");
			return;
		}
	}

	// Cargar Lista
	document.getElementById("hidORSParamStart").value = "";
	document.getElementById("hidORSParamStartAnt").value = "";
	fSessionValidate('fORSDataLoad');
}

function fORSPagSig() {
	fSessionValidate('fORSDataLoad');
}

function fORSDetRec() {
	fSessionValidate('fORSDetRecExec');
}

function fORSDetRecExec() {
	var oGrid = dijit.byId("dgrORSLista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una operaci&oacute;n.", "Advertencia", "W");
		return;
	}
	if (oItems[0].ESTADOS == "A") {
		fMsgBox("No se puede ver el detalle de una operaci&oacute;n ANULADA.",
				"Advertencia", "W");
		return;
	}
	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtORSFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtORSFecHas").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	// Nro. de Orden
	var vOrden = "";
	if (!isNaN(dijit.byId("txtORSOrden").get("value"))) {
		vOrden = dijit.byId("txtORSOrden").get("value");
	}
	url = fGetURLPag("interface/OpeReclamoDet.html?orden=" + oItems[0].ORDENS
			+ "&tipoInforme=ORS" + "&tipDoc="
			+ dijit.byId("cboORSTipDoc").get("value") + "&nroDoc="
			+ dijit.byId("txtORSNroDoc").get("value") + "&apellido="
			+ dijit.byId("txtORSApeRaz").get("value") + "&compania="
			+ dijit.byId("cboORSCompania").get("value") + "&poliza="
			+ dijit.byId("txtORSPoliza").get("value") + "&ordenPar=" + vOrden
			+ "&estado=" + dijit.byId("cboORSEstado").get("value")
			+ "&fechaDesde=" + vFecDes + "&fechaHasta=" + vFecHas
			+ "&paramStart="
			+ document.getElementById("hidORSParamStartAnt").value);
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onORDLoad();
	});
}
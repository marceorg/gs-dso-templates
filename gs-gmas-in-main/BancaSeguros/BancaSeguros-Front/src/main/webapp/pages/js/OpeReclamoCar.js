function onORCLoad() {
	// Inicializar
	fORCInitialize();
	// Busqueda
	fORCBusDialog();
}

function fORCBusDialog() {
	// Limpiar
	fORCClean();
	// Deshabilitar
	fORCReadOnly(true);
	// Limpiar Busqueda
	dijit.byId("txtORCApeRaz").set("value", "");
	dijit.byId("cboORCTipDoc").set("value", "");
	dijit.byId("cboORCCompania").set("value", "");
	fGridClean("dgrORCLista");
	// Mostrar Dialog
	dijit.byId("dlgORCFinder").show();
}

function fORCInitialize() {
	// Resize
	fBrowserResize();
	// Tama�o de botones
	dojo.style("btnORCNuevo", "width", "120px");
	dojo.style("btnORCImprimir", "width", "120px");
	dojo.style("btnORCEnviar", "width", "120px");
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
												.getElementById("hidORCFechaHoy").value = response.result;
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
				fComboAllLoad(response, "cboORCTipDoc", "...", "0");
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
				fComboAllLoad(response, "cboORCCompania", "...", "0");
			}
		}, function(err) {
			vRet = false;
		});
	});
}

// fin combo
function fORCReadOnly(value) {
	// Opciones
	dijit.byId("btnORCNuevo").set("disabled", false);
	if (value) {
		dijit.byId("btnORCImprimir").set("disabled", value);
	}
	dijit.byId("btnORCEnviar").set("disabled", value);
	// 2- Datos del Reclamo
	dijit.byId("cboORCTipoReg").set("disabled", value);
	dijit.byId("cboORCMotReg").set("disabled", value);
	dijit.byId("txtORCDescReclamo").set("disabled", value);
	dijit.byId("txtORCCliTelefono").set("disabled", value);
	dijit.byId("txtORCCliEmail").set("disabled", value);
	// 3- Archivos Adjuntos
	document.getElementById("txtORCUploadF1").disabled = value;
	document.getElementById("txtORCUploadF2").disabled = value;
	document.getElementById("txtORCUploadF3").disabled = value;
	dijit.byId("btnORCLimpiarAdj").set("disabled", value);
}

function fORCClean() {
	// Control de Publicacion
	document.getElementById("hidORCRetCtrl").value = "N";
	document.getElementById("hidORCRecipientTO").value = "";
	document.getElementById("hidORCOrden").value = "";
	document.getElementById("hidORCPaso").value = "0";
	// Cerrar Paneles
	fORCHelpOut();
	dijit.byId("tpnORCHelp").set("style", "display:none;");
	dijit.byId("tpnORCDatosPol").set("open", false);
	dijit.byId("tpnORCDatosRec").set("open", false);
	dijit.byId("tpnORCDatosAdj").set("open", false);
	// Panel 1
	document.getElementById("txtORCCompania").innerHTML = "";
	document.getElementById("txtORCProducto").innerHTML = "";
	document.getElementById("txtORCPoliza").innerHTML = "";
	document.getElementById("txtORCEndoso").innerHTML = "";
	document.getElementById("txtORCTomador").innerHTML = "";
	document.getElementById("txtORCDocumento").innerHTML = "";
	// Panel 2
	dijit.byId("cboORCTipoReg").set("value", "");
	dijit.byId("cboORCMotReg").set("value", "");
	dijit.byId("txtORCDescReclamo").set("value", "");
	dijit.byId("txtORCCliTelefono").set("value", "");
	dijit.byId("txtORCCliEmail").set("value", "");
	// Panel 3
	fGridClean("dgrORCDocList");
	// Panel 4
	fORCCleanAdj();
}

function fORCCleanAdj() {
	document.frmORCUpload1.reset();
	document.frmORCUpload2.reset();
	document.frmORCUpload3.reset();
}

function fORCBuscar() {
	// Validacion
	if (String(dijit.byId("txtORCApeRaz").get("value")).length == 0
			&& dijit.byId("cboORCTipDoc").get("value") == 0
			&& dijit.byId("cboORCCompania").get("value") == 0) {
		fMsgBox("Debe ingresar alg&uacute;n par&aacute;metro.",
				"Validaci&oacute;n", "E");
		return;
	}
	if ((String(dijit.byId("txtORCApeRaz").get("value")).length > 0 && dijit
			.byId("cboORCTipDoc").get("value") != 0)
			|| (String(dijit.byId("txtORCApeRaz").get("value")).length > 0 && dijit
					.byId("cboORCCompania").get("value") != 0)
			|| (dijit.byId("cboORCTipDoc").get("value") != 0 && dijit.byId(
					"cboORCCompania").get("value") != 0)) {
		fMsgBox("Debe buscar por un solo par&aacute;metro.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("cboORCTipDoc").get("value") != 0
			&& String(dijit.byId("txtORCNroDoc").get("value")).length == 0) {
		fMsgBox("Debe ingresar un n&uacute;mero de documento.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("cboORCCompania").get("value") != 0
			&& String(dijit.byId("txtORCPoliza").get("value")).length == 0) {
		fMsgBox("Debe un n&uacute;mero de p&oacute;liza.", "Validaci&oacute;n",
				"E");
		return;
	}

	fSessionValidate('fORCDataLoad');
}

function fORCDataLoad() {
	// Espera
	fWaitMsgBoxIni("Consultando", [ "Consultando Informaci&oacute;n..." ]);

	// Determinar tipo de busqueda
	var vTipoBusqueda = "N";
	if (dijit.byId("cboORCTipDoc").get("value") != 0) {
		vTipoBusqueda = "D";
	} else if (dijit.byId("cboORCCompania").get("value") != 0) {
		vTipoBusqueda = "P";
	}
	// Consulta Clientes
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var url = fGetURLSvc("BSService/getConClienteList?cache="
				+ fGetCacheRnd() + "&tipoBusqueda=" + vTipoBusqueda
				+ "&tipDoc=" + dijit.byId("cboORCTipDoc").get("value")
				+ "&nroDoc=" + dijit.byId("txtORCNroDoc").get("value")
				+ "&apellido=" + dijit.byId("txtORCApeRaz").get("value")
				+ "&compania=" + dijit.byId("cboORCCompania").get("value")
				+ "&poliza=" + dijit.byId("txtORCPoliza").get("value")
				+ "&paramStart=");
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
			// Si trae muchos
			if (vPStart != "") {
				fWaitMsgBoxUpd(0, "Demasiados resultados.", "W");
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

			if (dijit.byId("dgrORCLista") == null) {
				oGrid = new DataGrid({
					id : "dgrORCLista",
					store : jsonDataSource,
					structure : layout,
					rowSelector : "25px",
					rowCount : 20,
					style : 'width: 790px; height: 230px;',
					selectionMode : "single"
				}, "_divORCLista");

				oGrid.startup();
			} else {
				dijit.byId("dgrORCLista").setStructure(layout);
				dijit.byId("dgrORCLista").setStore(jsonDataSource);
			}

			// Mensaje de exito
			fWaitMsgBoxUpd(0, "Informe cargado.", "O");
			fWaitMsgBoxClose();
			dijit.byId("dlgWait").onCancel();

			// Cerra busqueda y abrir lista
			dijit.byId("dlgORCFinder").onCancel();
			dijit.byId("dlgORCLista").show();
			dijit.byId("dgrORCLista").update();

			fMnuDeselect();
		}, function(err) {
			fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.", "E");
			fWaitMsgBoxClose();
		});
	});
}

function fORCSeleccionar() {
	fSessionValidate('fORCSelecExec');
}

function fORCSelecExec() {
	var oGrid = dijit.byId("dgrORCLista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una operaci&oacute;n.", "Advertencia", "W");
		return;
	}

	// Campos Hidden
	document.getElementById("hidORCCompania").value = oItems[0].compania[0].id;
	document.getElementById("hidORCCompaniaDes").value = oItems[0].compania[0].name;
	document.getElementById("hidORCPoliza").value = oItems[0].poliza;
	document.getElementById("hidORCEndoso").value = oItems[0].endoso;

	// Espera
	fWaitMsgBoxIni("Consultando", [ "Consultando P&oacute;liza..." ]);

	// Consulta Poliza
	require(
			[ "dojo/request", "dojox/grid/DataGrid",
					"dojo/data/ItemFileWriteStore", "dojo/domReady!" ],
			function(request, DataGrid, ItemFileWriteStore) {
				var url = fGetURLSvc("BSService/getConPoliza?cache="
						+ fGetCacheRnd() + "&compania="
						+ oItems[0].compania[0].id + "&poliza="
						+ oItems[0].poliza + "&endoso=" + oItems[0].endoso);
				var deferred = request.get(url, {
					handleAs : "json",
					sync : true
				});

				deferred
						.then(
								function(response) {
									// Manejar Respuesta
									if (response.error) {
										fWaitMsgBoxUpd(
												0,
												"Se ha producido un error en la consulta.",
												"E");
										fWaitMsgBoxClose();
										return;
									}

									var vJSONDat = response.result;

									// Si no trae nada
									if (vJSONDat == null
											|| vJSONDat.length == 0) {
										fWaitMsgBoxUpd(
												0,
												"No se encontr&oacute; ning&uacute;n registro.",
												"W");
										fWaitMsgBoxClose();
										return;
									}

									// Datos
									fORCDataFill(vJSONDat);

									fORCReadOnly(false);

									// Mostrar Paneles
									dijit.byId("tpnORCDatosPol").set("open",
											true);
									dijit.byId("tpnORCDatosRec").set("open",
											true);
									dijit.byId("tpnORCDatosAdj").set("open",
											true);

									// Mensaje de exito
									fWaitMsgBoxUpd(0, "P&oacute;liza cargada.",
											"O");
									fWaitMsgBoxClose();
									dijit.byId("dlgWait").onCancel();
									dijit.byId("dlgORCLista").onCancel();

									fMnuDeselect();
									// Cargar Combo Tipo Reclamo
									fComboClean("cboORCTipoReg");
									require(
											[
													"dojo/request",
													"dojox/grid/DataGrid",
													"dojo/data/ItemFileWriteStore",
													"dojo/domReady!" ],
											function(request, DataGrid,
													ItemFileWriteStore) {
												var url = fGetURLSvc("BSService/getTipoReclamo?cache="
														+ fGetCacheRnd()
														+ "&compania="
														+ document
																.getElementById("hidORCCompania").value
														+ "&ramo="
														+ document
																.getElementById("hidORCProducto").value)
												var deferred = request.get(url,
														{
															handleAs : "json",
															sync : true
														});
												deferred
														.then(
																function(
																		response) {
																	// Manejar
																	// Respuesta
																	if (response.error) {
																		fWaitMsgBoxUpd(
																				0,
																				"Se ha producido un error al buscar los tipos de regitracion.",
																				"E");
																		fWaitMsgBoxClose();
																		return;
																	}

																	var vJSONDat = response.result;

																	// Si no
																	// trae nada
																	if (vJSONDat == null
																			|| !vJSONDat.jsonResult) {
																		fWaitMsgBoxUpd(
																				0,
																				"Se ha producido un error en la consulta 1201.",
																				"E");
																		fWaitMsgBoxClose();
																		return;
																	}
																	var vJSONDatREG = fJSONParse(vJSONDat.jsonResult);
																	if (vJSONDatREG == null
																			|| !vJSONDatREG.REGS
																			|| !vJSONDatREG.REGS.REG) {
																		fWaitMsgBoxUpd(
																				0,
																				"No se han encontrado datos.",
																				"E");
																		fWaitMsgBoxClose();
																		return;
																	}
																	fComboTipRec(
																			vJSONDatREG,
																			"cboORCTipoReg");
																},
																function(err) {
																	fWaitMsgBoxUpd(
																			0,
																			"Error en la consulta 1201.",
																			"E");
																	fWaitMsgBoxClose();
																});
											});

								},
								function(err) {
									fWaitMsgBoxUpd(
											0,
											"Se ha producido un error en la consulta.",
											"E");
									fWaitMsgBoxClose();
								});
			});
}
// Combo tipo rec
function fComboTipRec(vJSON, vCbo) {
	var oCbo = dijit.byId(vCbo);
	// Cargar uno blanco
	var oOpt = {};
	oOpt.label = "";
	oOpt.value = "";
	oOpt.selected = true;
	oCbo.addOption(oOpt);
	// Cargar combo
	for (var i = 0; i < vJSON.REGS.REG.length; i++) {
		var oOpt = {};
		oOpt.label = vJSON.REGS.REG[i].DESCTIPOREC;
		oOpt.value = String(vJSON.REGS.REG[i].TIPOREC);
		oOpt.selected = false;
		oCbo.addOption(oOpt);
	}
}

function fORCDataFill(vJSONDat) {
	// Campos Hidden
	document.getElementById("hidORCProducto").value = vJSONDat.producto.id;
	document.getElementById("hidORCTipDoc").value = vJSONDat.tipDocCod;
	document.getElementById("hidORCNroDoc").value = vJSONDat.nroDoc;
	document.getElementById("hidORCTomador").value = vJSONDat.tomador;
	// Datos a mostrar
	document.getElementById("txtORCCompania").innerHTML = document
			.getElementById("hidORCCompaniaDes").value;
	document.getElementById("txtORCProducto").innerHTML = vJSONDat.producto.id
			+ " " + vJSONDat.producto.name;
	document.getElementById("txtORCPoliza").innerHTML = document
			.getElementById("hidORCPoliza").value;
	document.getElementById("txtORCEndoso").innerHTML = document
			.getElementById("hidORCEndoso").value;
	document.getElementById("txtORCTomador").innerHTML = vJSONDat.tomador;
	document.getElementById("txtORCDocumento").innerHTML = vJSONDat.tipDoc
			+ " " + vJSONDat.nroDoc;
	document.getElementById("hidORCNomTDoc").value = vJSONDat.tipDoc;
	document.getElementById("hidORCNumeroDoc").value = vJSONDat.nroDoc;
	// eMail
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
									if (String(response.result[i].id) == document
											.getElementById("hidORCCompania").value) {
										document
												.getElementById("hidORCRecipientTO").value = response.result[i].recemail;
										break;
									}
								}
							}
						});
			});

}

function fORCTDoSel(value) {
	dijit.byId("txtORCNroDoc").set("value", "");
	if (value == "0") {
		dijit.byId("txtORCNroDoc").set("disabled", true);
	} else {
		dijit.byId("txtORCNroDoc").set("disabled", false);
	}
}

function fORCCiaSel(value) {
	dijit.byId("txtORCPoliza").set("value", "");
	document.getElementById("lblORCPolEjemplo").innerHTML = "";
	if (value == "0") {
		dijit.byId("txtORCPoliza").set("disabled", true);
	} else {
		dijit.byId("txtORCPoliza").set("disabled", false);
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
												.byId("cboORCCompania").get(
														"value")) {
											document
													.getElementById("lblORCPolEjemplo").innerHTML = response.result[i].ejePoliza;
											break;
										}
									}
								}
							});
				});
	}
}

function fORCRecShow(value) {
	// Cargar Combo Motivo Reclamo
	fComboClean("cboORCMotReg");
	require(
			[ "dojo/request", "dojox/grid/DataGrid",
					"dojo/data/ItemFileWriteStore", "dojo/domReady!" ],
			function(request, DataGrid, ItemFileWriteStore) {
				var url = fGetURLSvc("BSService/getMotReclamo?cache="
						+ fGetCacheRnd() + "&compania="
						+ document.getElementById("hidORCCompania").value
						+ "&ramo="
						+ document.getElementById("hidORCProducto").value
						+ "&tiporec=" + value)
				var deferred = request.get(url, {
					handleAs : "json",
					sync : true
				});
				deferred
						.then(
								function(response) {
									// Manejar
									// Respuesta
									if (response.error) {
										fWaitMsgBoxUpd(
												0,
												"Se ha producido un error al buscar los Motivos de regitracion.",
												"E");
										fWaitMsgBoxClose();
										return;
									}

									var vJSONDat = response.result;

									// Si no
									// trae nada
									if (vJSONDat == null
											|| !vJSONDat.jsonResult) {
										fWaitMsgBoxUpd(
												0,
												"Se ha producido un error en la consulta 1202.",
												"E");
										fWaitMsgBoxClose();
										return;
									}
									var vJSONDatREG = fJSONParse(vJSONDat.jsonResult);
									if (vJSONDatREG == null
											|| !vJSONDatREG.REGS
											|| !vJSONDatREG.REGS.REG) {
										fWaitMsgBoxUpd(
												0,
												"No se han encontrado Mot.Rec.",
												"E");
										fWaitMsgBoxClose();
										return;
									}
									fComboMotRec(vJSONDatREG, "cboORCMotReg");
									document.getElementById("hidORCHelpMot").value = vJSONDat.jsonResult
								}, function(err) {
									fWaitMsgBoxUpd(0,
											"Error en la consulta 1202.", "E");
									fWaitMsgBoxClose();
								});
			});
	document.getElementById("trORCMotivo").style.display = "";
}

// Combo tipo rec
function fComboMotRec(vJSON, vCbo) {
	var oCbo = dijit.byId(vCbo);
	// Cargar uno blanco
	var oOpt = {};
	oOpt.label = "";
	oOpt.value = "";
	oOpt.selected = true;
	oCbo.addOption(oOpt);
	// Cargar combo
	for (var i = 0; i < vJSON.REGS.REG.length; i++) {
		var oOpt = {};
		oOpt.label = vJSON.REGS.REG[i].DESCMOTIVOREC;
		oOpt.value = String(vJSON.REGS.REG[i].MOTIVO);
		oOpt.selected = false;
		oCbo.addOption(oOpt);
	}

}
function fORCMotShow(value) {
	var vJSONMotREG = fJSONParse(document.getElementById("hidORCHelpMot").value);
	document.getElementById("txtORCDescReclamo").value = "";
	// Cargar combo
	for (var i = 0; i < vJSONMotREG.REGS.REG.length; i++) {
		if (vJSONMotREG.REGS.REG[i].MOTIVO == value) {
			document.getElementById("txtORCDescReclamo").value = vJSONMotREG.REGS.REG[i].DESCAYUDA;
		}
	}
}

function fORCNuevo() {
	fQstBox(
			"Est&aacute; seguro de cargar un nuevo Pedido?<br/>Se perderan los cambios realizados",
			"fORCBusDialog()");
}

function fORCImprimir() {
	fSessionValidate('fORCImprimirExec');
}

function fORCImprimirExec() {
	window.open(fGetURLMVC("retrieveSvc.html?" + "cache=" + fGetCacheRnd()
			+ "&tipo=R&orden=" + document.getElementById("hidORCOrden").value
			+ "&compania="
			+ document.getElementById("txtORCCompania").innerHTML
			+ "&producto="
			+ document.getElementById("txtORCProducto").innerHTML + "&poliza="
			+ document.getElementById("txtORCPoliza").innerHTML + "&endoso="
			+ document.getElementById("hidORCEndoso").value + "&tomador="
			+ fEncodeURI(document.getElementById("txtORCTomador").innerHTML)
			+ "&tipDoc=" + document.getElementById("hidORCNomTDoc").value
			+ "&nroDoc=" + document.getElementById("hidORCNumeroDoc").value
			+ "&fechaPedido=" + document.getElementById("hidORCFechaHoy").value
			+ "&tipReg=" + (dijit.byId("cboORCTipoReg").get("displayedValue"))
			+ "&motRec=" + (dijit.byId("cboORCMotReg").get("displayedValue"))
			+ "&descRec="
			+ fEncodeURI(dijit.byId("txtORCDescReclamo").get("value"))
			+ "&telefono="
			+ fEncodeURI(dijit.byId("txtORCCliTelefono").get("value"))
			+ "&email=" + fEncodeURI(dijit.byId("txtORCCliEmail").get("value"))
			+ "&peopleSoft= "), "impreso",
			"resizable=yes,height=550,width=750,top=50,left=100");
}

function fORCEnviar() {
	fQstBox("Est&aacute; seguro de enviar el Pedido?",
			"fSessionValidate('fORCEnviarExec')");
}

function fORCEnviarExec(vUser, vProfile, vLName, vFName) {
	// Validacion
	if (dijit.byId("cboORCTipoReg").get("value") == "") {
		fMsgBox("Debe seleccionar el Tipo de Registraci&oacute;n.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("cboORCMotReg").get("value") == "") {
		fMsgBox("Debe seleccionar el Motivo.", "Validaci&oacute;n", "E");
		return;
	}
	if (String(dijit.byId("txtORCDescReclamo").get("value")).length == 0) {
		fMsgBox("Debe ingresar la Descripci&oacute;n del Pedido.",
				"Validaci&oacute;n", "E");
		return;
	} else {
		if (!fValType("T", dijit.byId("txtORCDescReclamo").get("value"))) {
			fMsgBox(
					"Existen caracteres no v&aacute;lidos en la Descripci&oacute;n del Pedido.",
					"Validaci&oacute;n", "E");
			return;
		}
	}
	if (String(dijit.byId("txtORCCliTelefono").get("value")).length == 0
			&& String(dijit.byId("txtORCCliEmail").get("value")).length == 0) {
		fMsgBox("Debe ingresar un tel&eacute;fono o un eMail", "Advertencia",
				"W");
		return;
	}
	if (String(dijit.byId("txtORCCliTelefono").get("value")).length != 0) {
		if (!fValType("R", String(dijit.byId("txtORCCliTelefono").get("value")))) {
			fMsgBox("Debe ingresar un tel&eacute;fono v&aacute;lido.",
					"Advertencia", "W");
			return;
		}
	}
	if (String(dijit.byId("txtORCCliEmail").get("value")).length != 0) {
		if (!fValType("M", String(dijit.byId("txtORCCliEmail").get("value")))) {
			fMsgBox("Debe ingresar un eMail v&aacute;lido.", "Advertencia", "W");
			return;
		}
	}
	/*
	 * if (fORCContAdj() == 0) { fMsgBox("Debe adjuntar al menos un archivo.",
	 * "Validaci&oacute;n", "E"); return; }
	 */
	if (document.getElementById("txtORCUploadF1").value != "") {
		if (document.getElementById("txtORCUploadF1").value.substr(
				document.getElementById("txtORCUploadF1").value.length - 4)
				.toUpperCase() != ".PDF") {
			fMsgBox("El Archivo Adjunto 1 debe ser un PDF.",
					"Validaci&oacute;n", "E");
			return;
		}
	}
	if (document.getElementById("txtORCUploadF2").value != "") {
		if (document.getElementById("txtORCUploadF2").value.substr(
				document.getElementById("txtORCUploadF2").value.length - 4)
				.toUpperCase() != ".PDF") {
			fMsgBox("El Archivo Adjunto 2 debe ser un PDF.",
					"Validaci&oacute;n", "E");
			return;
		}
	}
	if (document.getElementById("txtORCUploadF3").value != "") {
		if (document.getElementById("txtORCUploadF3").value.substr(
				document.getElementById("txtORCUploadF3").value.length - 4)
				.toUpperCase() != ".PDF") {
			fMsgBox("El Archivo Adjunto 3 debe ser un PDF.",
					"Validaci&oacute;n", "E");
			return;
		}
	}
	if ((document.getElementById("txtORCUploadF1").value != "" && document
			.getElementById("txtORCUploadF1").value == document
			.getElementById("txtORCUploadF2").value)
			|| (document.getElementById("txtORCUploadF1").value != "" && document
					.getElementById("txtORCUploadF1").value == document
					.getElementById("txtORCUploadF3").value)
			|| (document.getElementById("txtORCUploadF2").value != "" && document
					.getElementById("txtORCUploadF2").value == document
					.getElementById("txtORCUploadF3").value)) {
		fMsgBox("No se puede adjuntar el mismo archivo varias veces.",
				"Validaci&oacute;n", "E");
		return;
	}

	fORCSend(vUser, vProfile, vLName, vFName);
}

function fORCSend(vUser, vProfile, vLName, vFName) {
	// Espera
	fWaitMsgBoxIni("Procesando...", [ "Obtener Nro Orden",
			"Adjuntar Archivo 1", "Adjuntar Archivo 2", "Adjuntar Archivo 3",
			"Guardar Pedido", "Enviar eMail", "Confirmar Env&iacute;o",
			"Estado del Proceso" ]);
	// Verificar Paso
	if (document.getElementById("hidORCPaso").value > "0") {
		fWaitMsgBoxUpd(0, "Ya se obtuvo el Nro Orden: "
				+ document.getElementById("hidORCOrden").value, "I");
		fORCPublish1();
		return;
	}
	// Guardando Pedido
	require(
			[ "dojo/request", "dojo/domReady!" ],
			function(request) {
				fWaitMsgBoxUpd(0, "Obteniendo Nro Orden...", "A");

				var vURL = fGetURLSvc("BSService/setOpeReclamo");
				var vPar = fORCSendGetSave(vUser, vProfile, vLName, vFName);

				var deferred = request.post(vURL, {
					handleAs : "json",
					data : vPar
				});

				deferred
						.then(
								function(response) {
									if (response.error || !response.result
											|| !response.result.jsonResult) {
										fWaitMsgBoxUpd(
												0,
												"Se ha producido un error al obtener el Nro Orden (1).",
												"E");
										fWaitMsgBoxUpd(
												7,
												"Proceso finalizado con errores. Intente nuevamente (1).",
												"E");
										fWaitMsgBoxClose();
									} else {
										var vJSONDatREG = fJSONParse(response.result.jsonResult);
										if (!vJSONDatREG
												|| !vJSONDatREG.NROORDEN) {
											fWaitMsgBoxUpd(
													0,
													"Se ha producido un error al obtener el Nro Orden (2).",
													"E");
											fWaitMsgBoxUpd(
													7,
													"Proceso finalizado con errores. Intente nuevamente (2).",
													"E");
											fWaitMsgBoxClose();
										} else {
											fWaitMsgBoxUpd(
													0,
													"Se ha obtenido el Nro Orden: "
															+ vJSONDatREG.NROORDEN,
													"O");
											// Publicar
											document
													.getElementById("hidORCOrden").value = vJSONDatREG.NROORDEN;
											document
													.getElementById("hidORCPaso").value = "1";
											fORCPublish1();
										}
									}
								},
								function(err) {
									fWaitMsgBoxUpd(
											0,
											"Se ha producido un error al obtener el Nro Orden (3).",
											"E");
									fWaitMsgBoxUpd(
											7,
											"Proceso finalizado con errores. Intente nuevamente (3).",
											"E");
									fWaitMsgBoxClose();
								});
			});
}

function fORCSendGetSave(vUser, vProfile, vLName, vFName) {
	var vPar = "";

	vPar += "cache=" + fGetCacheRnd();
	vPar += "&companiaId=" + document.getElementById("hidORCCompania").value;
	vPar += "&productoId=" + document.getElementById("hidORCProducto").value;
	vPar += "&poliza=" + document.getElementById("hidORCPoliza").value;
	vPar += "&endoso=" + document.getElementById("hidORCEndoso").value;
	vPar += "&tomador="
			+ fEncodeURI(document.getElementById("hidORCTomador").value);
	vPar += "&tipDoc=" + document.getElementById("hidORCTipDoc").value;
	vPar += "&nroDoc=" + document.getElementById("hidORCNroDoc").value;
	vPar += "&fechaPedido=" + document.getElementById("hidORCFechaHoy").value;
	vPar += "&tipReg=" + (dijit.byId("cboORCTipoReg").get("value"));
	vPar += "&tipMot=" + (dijit.byId("cboORCMotReg").get("value"));
	vPar += "&descPedido="
			+ fEncodeURI(dijit.byId("txtORCDescReclamo").get("value"));
	vPar += "&telefono="
			+ fEncodeURI(dijit.byId("txtORCCliTelefono").get("value"));
	vPar += "&email=" + fEncodeURI(dijit.byId("txtORCCliEmail").get("value"));
	vPar += "&peopleSoft=" + vUser;
	vPar += "&usuApeNom=" + vLName + " " + vFName;

	return vPar;
}

function fORCPublish1() {
	// Verificar Adjunto
	if (document.getElementById("txtORCUploadF1").value == "") {
		fWaitMsgBoxUpd(1, "No se adjunta Archivo 1.", "I");
		fORCPublish2();
		return;
	}
	// Verificar Paso
	if (document.getElementById("hidORCPaso").value > "1") {
		fWaitMsgBoxUpd(1, "El Archivo 1 ya fue adjuntado.", "I");
		fORCPublish2();
		return;
	}

	fWaitMsgBoxUpd(1, "Adjuntando Archivo 1...", "A");
	// para utilizar el repositorio de coldview de denuncia, se suma 10000 al
	// nro. de orden para que no de duplicado
	document.getElementById("hidORCRetCtrl").value = "S";
	var ordenCV = parseInt(document.getElementById("hidORCOrden").value) + 10000;
	document.frmORCUpload1.action = fGetURLMVC("publishSvc.html") + "?orden="
			+ ordenCV;
	document.frmORCUpload1.submit();
}

function fORCPublishRet1() {
	if (document.getElementById("hidORCRetCtrl").value == "S") {
		document.getElementById("hidORCRetCtrl").value = "N";
		var vIfr = document.getElementById("ifrORCUpload1");
		var vCnt = (vIfr.contentWindow || vIfr.contentDocument);
		if (vCnt.document) {
			vCnt = vCnt.document;
		}
		var vRet = vCnt.body.innerHTML;
		if (vRet.toUpperCase() != "<PRE>S</PRE>") {
			fWaitMsgBoxUpd(1,
					"Se ha producido un error al adjuntar archivo 1.", "E");
			fWaitMsgBoxUpd(7,
					"Proceso finalizado con errores. Intente nuevamente.", "E");
			fWaitMsgBoxClose();
		} else {
			// Enviar Mail
			fWaitMsgBoxUpd(1, "El Archivo 1 fue adjuntado con &eacute;xito!",
					"O");
			document.getElementById("hidORCPaso").value = "2";
			fORCPublish2();
		}
	}
}

function fORCPublish2() {
	// Verificar Adjunto
	if (document.getElementById("txtORCUploadF2").value == "") {
		fWaitMsgBoxUpd(2, "No se adjunta Archivo 2.", "I");
		fORCPublish3();
		return;
	}
	// Verificar Paso
	if (document.getElementById("hidORCPaso").value > "2") {
		fWaitMsgBoxUpd(2, "El Archivo 2 ya fue adjuntado.", "I");
		fORCPublish3();
		return;
	}

	fWaitMsgBoxUpd(2, "Adjuntando Archivo 2...", "A");

	document.getElementById("hidORCRetCtrl").value = "S";
	var ordenCV = parseInt(document.getElementById("hidORCOrden").value) + 10000;
	document.frmORCUpload2.action = fGetURLMVC("publishSvc.html") + "?orden="
			+ ordenCV;
	document.frmORCUpload2.submit();
}

function fORCPublishRet2() {
	if (document.getElementById("hidORCRetCtrl").value == "S") {
		document.getElementById("hidORCRetCtrl").value = "N";
		var vIfr = document.getElementById("ifrORCUpload2");
		var vCnt = (vIfr.contentWindow || vIfr.contentDocument);
		if (vCnt.document) {
			vCnt = vCnt.document;
		}
		var vRet = vCnt.body.innerHTML;
		if (vRet.toUpperCase() != "<PRE>S</PRE>") {
			fWaitMsgBoxUpd(2,
					"Se ha producido un error al adjuntar archivo 2.", "E");
			fWaitMsgBoxUpd(7,
					"Proceso finalizado con errores. Intente nuevamente.", "E");
			fWaitMsgBoxClose();
		} else {
			// Enviar Mail
			fWaitMsgBoxUpd(2, "El Archivo 2 fue adjuntado con &eacute;xito!",
					"O");
			document.getElementById("hidORCPaso").value = "3";
			fORCPublish3();
		}
	}
}

function fORCPublish3() {
	// Verificar Adjunto
	if (document.getElementById("txtORCUploadF3").value == "") {
		fWaitMsgBoxUpd(3, "No se adjunta Archivo 3.", "I");
		fORCSaveDen();
		return;
	}
	// Verificar Paso
	if (document.getElementById("hidORCPaso").value > "3") {
		fWaitMsgBoxUpd(3, "El Archivo 3 ya fue adjuntado.", "I");
		fORCSaveDen();
		return;
	}

	fWaitMsgBoxUpd(3, "Adjuntando Archivo 3...", "A");

	document.getElementById("hidORCRetCtrl").value = "S";
	var ordenCV = parseInt(document.getElementById("hidORCOrden").value) + 10000;
	document.frmORCUpload3.action = fGetURLMVC("publishSvc.html") + "?orden="
			+ ordenCV;
	document.frmORCUpload3.submit();
}

function fORCPublishRet3() {
	if (document.getElementById("hidORCRetCtrl").value == "S") {
		document.getElementById("hidORCRetCtrl").value = "N";
		var vIfr = document.getElementById("ifrORCUpload3");
		var vCnt = (vIfr.contentWindow || vIfr.contentDocument);
		if (vCnt.document) {
			vCnt = vCnt.document;
		}
		var vRet = vCnt.body.innerHTML;
		if (vRet.toUpperCase() != "<PRE>S</PRE>") {
			fWaitMsgBoxUpd(3,
					"Se ha producido un error al adjuntar archivo 3.", "E");
			fWaitMsgBoxUpd(7,
					"Proceso finalizado con errores. Intente nuevamente.", "E");
			fWaitMsgBoxClose();
		} else {
			// Enviar Mail
			fWaitMsgBoxUpd(3, "El Archivo 3 fue adjuntado con &eacute;xito!",
					"O");
			document.getElementById("hidORCPaso").value = "4";
			fORCSaveDen();
		}
	}
}

function fORCSaveDen() {
	// Verificar Paso
	if (document.getElementById("hidORCPaso").value > "4") {
		fWaitMsgBoxUpd(4, "Ya se ha guardado el Pedido."
				+ document.getElementById("hidORCOrden").value, "I");
		fORCSendMail();
		return;
	}

	fWaitMsgBoxUpd(4, "Guardando Pedido...", "A");
	// Cambiar Estado a PENDIENTE
	require(
			[ "dojo/request", "dojo/domReady!" ],
			function(request) {

				var vURL = fGetURLSvc("BSService/setOpeReclamoEst?cache="
						+ fGetCacheRnd() + "&orden="
						+ document.getElementById("hidORCOrden").value
						+ "&estado=P");
				var deferred = request.get(vURL, {
					handleAs : "json"
				});
				deferred
						.then(
								function(response) {
									if (response.error || !response.result) {
										fWaitMsgBoxUpd(
												4,
												"Se ha producido un error al guardar el Pedido.",
												"E");
										fWaitMsgBoxUpd(
												7,
												"Proceso finalizado con errores. Intente nuevamente.",
												"E");
										fWaitMsgBoxClose();
									} else if (response.result) {
										fWaitMsgBoxUpd(
												4,
												"El Pedido fue guardado con &eacute;xito!",
												"O");
										document.getElementById("hidORCPaso").value = "5";
										fORCSendMail();
									}
								},
								function(err) {
									fWaitMsgBoxUpd(
											4,
											"Se ha producido un error al guardar el Pedido.",
											"E");
									fWaitMsgBoxUpd(
											7,
											"Proceso finalizado con errores. Intente nuevamente.",
											"E");
									fWaitMsgBoxClose();
								});
			});
}

function fORCSendMail() {
	// Verificar Paso
	if (document.getElementById("hidORCPaso").value > "5") {
		fWaitMsgBoxUpd(5, "Ya se ha enviado el eMail."
				+ document.getElementById("hidORCOrden").value, "I");
		fORCConfEnv();
		return;
	}

	fWaitMsgBoxUpd(5, "Enviando eMail...", "A");
	// Enviar EMail
	require(
			[ "dojo/request", "dojo/domReady!" ],
			function(request) {

				var vURL = fGetURLSvc("BSService/setOpeReclamoSendMail?cache="
						+ fGetCacheRnd()
						+ "&orden="
						+ document.getElementById("hidORCOrden").value
						+ "&recipientTO="
						+ document.getElementById("hidORCRecipientTO").value
						+ "&cantAdj="
						+ fORCContAdj()
						+ "&compania="
						+ document.getElementById("txtORCCompania").innerHTML
						+ "&producto="
						+ document.getElementById("txtORCProducto").innerHTML
						+ "&poliza="
						+ document.getElementById("txtORCPoliza").innerHTML
						+ "&endoso="
						+ document.getElementById("hidORCEndoso").value
						+ "&tomador="
						+ fEncodeURI(document.getElementById("txtORCTomador").innerHTML)
						+ "&tipDoc="
						+ document.getElementById("hidORCNomTDoc").value
						+ "&nroDoc="
						+ document.getElementById("hidORCNumeroDoc").value
						+ "&fechaPedido="
						+ document.getElementById("hidORCFechaHoy").value
						+ "&tipReg="
						+ (dijit.byId("cboORCTipoReg").get("displayedValue"))
						+ "&motRec="
						+ (dijit.byId("cboORCMotReg").get("displayedValue"))
						+ "&descRec="
						+ fEncodeURI(dijit.byId("txtORCDescReclamo").get(
								"value"))
						+ "&telefono="
						+ fEncodeURI(dijit.byId("txtORCCliTelefono").get(
								"value")) + "&email="
						+ fEncodeURI(dijit.byId("txtORCCliEmail").get("value"))
						+ "&peopleSoft= ");
				var deferred = request.post(vURL, {
					handleAs : "json"
				});

				deferred
						.then(
								function(response) {
									if (response.error || !response.result) {
										fWaitMsgBoxUpd(
												5,
												"Se ha producido un error al enviar el email.",
												"E");
										fWaitMsgBoxUpd(
												7,
												"Proceso finalizado con errores. Intente nuevamente.",
												"E");
										fWaitMsgBoxClose();
									} else if (response.result) {
										fWaitMsgBoxUpd(
												5,
												"El email fue enviado con &eacute;xito!",
												"O");
										document.getElementById("hidORCPaso").value = "6";
										fORCConfEnv();
									}
								},
								function(err) {
									fWaitMsgBoxUpd(
											5,
											"Se ha producido un error al enviar el email.",
											"E");
									fWaitMsgBoxUpd(
											7,
											"Proceso finalizado con errores. Intente nuevamente.",
											"E");
									fWaitMsgBoxClose();
								});
			});
}

function fORCConfEnv() {
	fWaitMsgBoxUpd(6, "Confirmando Env&iacute;o...", "A");
	// Cambiar Estado a ENVIADO
	require(
			[ "dojo/request", "dojo/domReady!" ],
			function(request) {

				var vURL = fGetURLSvc("BSService/setOpeReclamoEst?cache="
						+ fGetCacheRnd() + "&orden="
						+ document.getElementById("hidORCOrden").value
						+ "&estado=E");
				var deferred = request.get(vURL, {
					handleAs : "json"
				});

				deferred
						.then(
								function(response) {
									if (response.error || !response.result) {
										fWaitMsgBoxUpd(
												6,
												"Se ha producido un error al confirmar el env&iacute;o.",
												"E");
										fWaitMsgBoxUpd(
												7,
												"Proceso finalizado con errores. Intente nuevamente.",
												"E");
										fWaitMsgBoxClose();
									} else if (response.result) {
										fWaitMsgBoxUpd(
												6,
												"El env&iacute;o se ha confirmado con &eacute;xito!",
												"O");
										fWaitMsgBoxUpd(
												7,
												"Proceso finalizado con &eacute;xito!",
												"O");
										fWaitMsgBoxClose();
										fORCReadOnly(true);
										dijit.byId("btnORCImprimir").set(
												"disabled", false);
										document.getElementById("hidORCPaso").value = "7";
									}
								},
								function(err) {
									fWaitMsgBoxUpd(
											6,
											"Se ha producido un error al confirmar el env&iacute;o.",
											"E");
									fWaitMsgBoxUpd(
											7,
											"Proceso finalizado con errores. Intente nuevamente.",
											"E");
									fWaitMsgBoxClose();
								});
			});
}

function fORCContAdj() {
	var vRet = 0;
	if (document.getElementById("txtORCUploadF1").value != "") {
		vRet++;
	}
	if (document.getElementById("txtORCUploadF2").value != "") {
		vRet++;
	}
	if (document.getElementById("txtORCUploadF3").value != "") {
		vRet++;
	}
	return vRet;
}

function fORCHelpIn() {

}

function fORCHelpOut() {

}
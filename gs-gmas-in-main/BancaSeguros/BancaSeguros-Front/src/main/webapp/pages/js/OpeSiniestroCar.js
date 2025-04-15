function onOSCLoad() {
	// Inicializar
	fOSCInitialize();
	// Busqueda
	fOSCBusDialog();
}

function fOSCBusDialog() {
	// Limpiar
	fOSCClean();
	// Deshabilitar
	fOSCReadOnly(true);
	// Limpiar Busqueda
	dijit.byId("txtOSCApeRaz").set("value", "");
	dijit.byId("cboOSCTipDoc").set("value", "");
	dijit.byId("cboOSCCompania").set("value", "");
	fGridClean("dgrOSCLista");
	// Mostrar Dialog
	dijit.byId("dlgOSCFinder").show();
}

function fOSCInitialize() {
	// Resize
	fBrowserResize();
	// Tamano de botones
	dojo.style("btnOSCNuevo", "width", "120px");
	dojo.style("btnOSCImprimir", "width", "120px");
	dojo.style("btnOSCEnviar", "width", "120px");
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
												.getElementById("hidOSCFechaHoy").value = response.result;
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
				fComboAllLoad(response, "cboOSCTipDoc", "...", "0");
				fComboLoad(response, "cboOSCDenTipDoc");
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
				fComboAllLoad(response, "cboOSCCompania", "...", "0");
			}
		}, function(err) {
			vRet = false;
		});
	});
	// Cargar Combo Parentescos
	require([ "dojo/request", "dojo/domReady!" ], function(request) {

		var vURL = fGetURLSvc("ParametersService/getParentescoList");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});

		deferred.then(function(response) {
			if (response.error) {
				vRet = false;
			} else {
				fComboLoad(response, "cboOSCDenParentesco");
			}
		}, function(err) {
			vRet = false;
		});
	});
}

function fOSCReadOnly(value) {
	// Opciones
	dijit.byId("btnOSCNuevo").set("disabled", false);
	if (value) {
		dijit.byId("btnOSCImprimir").set("disabled", value);
	}
	dijit.byId("btnOSCEnviar").set("disabled", value);
	// 2- Datos del Siniestro
	dijit.byId("txtOSCFechaSiniestro").set("disabled", value);
	dijit.byId("cboOSCDenunciante").set("disabled", value);
	dijit.byId("cboOSCDenTipDoc").set("disabled", value);
	dijit.byId("txtOSCDenNroDoc").set("disabled", value);
	dijit.byId("txtOSCDenApellido").set("disabled", value);
	dijit.byId("cboOSCDenParentesco").set("disabled", value);
	dijit.byId("txtOSCDescSiniestro").set("disabled", value);
	dijit.byId("txtOSCDatosSiniestro").set("disabled", value);
	// 3- Archivos Adjuntos
	document.getElementById("txtOSCUploadF1").disabled = value;
	document.getElementById("txtOSCUploadF2").disabled = value;
	document.getElementById("txtOSCUploadF3").disabled = value;
	dijit.byId("btnOSCLimpiarAdj").set("disabled", value);
}

function fOSCClean() {
	// Control de Publicacion
	document.getElementById("hidOSCRetCtrl").value = "N";
	document.getElementById("hidOSCRecipientTO").value = "";
	document.getElementById("hidOSCOrden").value = "";
	document.getElementById("hidOSCPaso").value = "0";
	// Cerrar Paneles
	fOSCHelpOut();
	dijit.byId("tpnOSCHelp").set("style", "display:none;");
	dijit.byId("tpnOSCDatosPol").set("open", false);
	dijit.byId("tpnOSCDatosSin").set("open", false);
	dijit.byId("tpnOSCDatosDoc").set("open", false);
	dijit.byId("tpnOSCDatosAdj").set("open", false);
	// Panel 1
	document.getElementById("txtOSCCompania").innerHTML = "";
	document.getElementById("txtOSCProducto").innerHTML = "";
	document.getElementById("txtOSCPoliza").innerHTML = "";
	document.getElementById("txtOSCTomador").innerHTML = "";
	document.getElementById("txtOSCDocumento").innerHTML = "";
	// Panel 2
	dijit.byId("txtOSCFechaSiniestro").set("value", null);
	dijit.byId("cboOSCDenunciante").set("value", "");
	dijit.byId("cboOSCDenTipDoc").set("value", "");
	dijit.byId("txtOSCDenNroDoc").set("value", "");
	dijit.byId("txtOSCDenApellido").set("value", "");
	dijit.byId("cboOSCDenParentesco").set("value", "");
	dijit.byId("txtOSCDescSiniestro").set("value", "");
	dijit.byId("txtOSCDatosSiniestro").set("value", "");
	// Panel 3
	fGridClean("dgrOSCDocList");
	// Panel 4
	fOSCCleanAdj();
}

function fOSCCleanAdj() {
	document.frmOSCUpload1.reset();
	document.frmOSCUpload2.reset();
	document.frmOSCUpload3.reset();
}

function fOSCBuscar() {
	// Validacion
	if (String(dijit.byId("txtOSCApeRaz").get("value")).length == 0
			&& dijit.byId("cboOSCTipDoc").get("value") == 0
			&& dijit.byId("cboOSCCompania").get("value") == 0) {
		fMsgBox("Debe ingresar alg&uacute;n par&aacute;metro.",
				"Validaci&oacute;n", "E");
		return;
	}
	if ((String(dijit.byId("txtOSCApeRaz").get("value")).length > 0 && dijit
			.byId("cboOSCTipDoc").get("value") != 0)
			|| (String(dijit.byId("txtOSCApeRaz").get("value")).length > 0 && dijit
					.byId("cboOSCCompania").get("value") != 0)
			|| (dijit.byId("cboOSCTipDoc").get("value") != 0 && dijit.byId(
					"cboOSCCompania").get("value") != 0)) {
		fMsgBox("Debe buscar por un solo par&aacute;metro.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("cboOSCTipDoc").get("value") != 0
			&& String(dijit.byId("txtOSCNroDoc").get("value")).length == 0) {
		fMsgBox("Debe ingresar un n&uacute;mero de documento.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("cboOSCCompania").get("value") != 0
			&& String(dijit.byId("txtOSCPoliza").get("value")).length == 0) {
		fMsgBox("Debe un n&uacute;mero de p&oacute;liza.", "Validaci&oacute;n",
				"E");
		return;
	}

	fSessionValidate('fOSCDataLoad');
}

function fOSCDataLoad() {
	// Espera
	fWaitMsgBoxIni("Consultando", [ "Consultando Informaci&oacute;n..." ]);

	// Determinar tipo de busqueda
	var vTipoBusqueda = "N";
	if (dijit.byId("cboOSCTipDoc").get("value") != 0) {
		vTipoBusqueda = "D";
	} else if (dijit.byId("cboOSCCompania").get("value") != 0) {
		vTipoBusqueda = "P";
	}
	// Consulta Clientes
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var url = fGetURLSvc("BSService/getConClienteList?cache="
				+ fGetCacheRnd() + "&tipoBusqueda=" + vTipoBusqueda
				+ "&tipDoc=" + dijit.byId("cboOSCTipDoc").get("value")
				+ "&nroDoc=" + dijit.byId("txtOSCNroDoc").get("value")
				+ "&apellido=" + dijit.byId("txtOSCApeRaz").get("value")
				+ "&compania=" + dijit.byId("cboOSCCompania").get("value")
				+ "&poliza=" + dijit.byId("txtOSCPoliza").get("value")
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
				fWaitMsgBoxUpd(0, "No se encontr&oacute; ning&uacute;n registro.", "W");
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

			if (dijit.byId("dgrOSCLista") == null) {
				oGrid = new DataGrid({
					id : "dgrOSCLista",
					store : jsonDataSource,
					structure : layout,
					rowSelector : "25px",
					rowCount : 20,
					style : 'width: 790px; height: 230px;',
					selectionMode : "single"
				}, "_divOSCLista");

				oGrid.startup();
			} else {
				dijit.byId("dgrOSCLista").setStructure(layout);
				dijit.byId("dgrOSCLista").setStore(jsonDataSource);
			}

			// Mensaje de exito
			fWaitMsgBoxUpd(0, "Informe cargado.", "O");
			fWaitMsgBoxClose();
			dijit.byId("dlgWait").onCancel();

			// Cerra busqueda y abrir lista
			dijit.byId("dlgOSCFinder").onCancel();
			dijit.byId("dlgOSCLista").show();
			dijit.byId("dgrOSCLista").update();

			fMnuDeselect();
		}, function(err) {
			fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.", "E");
			fWaitMsgBoxClose();
		});
	});
}

function fOSCSeleccionar() {
	fSessionValidate('fOSCSelecExec');
}

function fOSCSelecExec() {
	var oGrid = dijit.byId("dgrOSCLista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una operaci&oacute;n.", "Advertencia", "W");
		return;
	}

	// Campos Hidden
	document.getElementById("hidOSCCompania").value = oItems[0].compania[0].id;
	document.getElementById("hidOSCCompaniaDes").value = oItems[0].compania[0].name;
	document.getElementById("hidOSCPoliza").value = oItems[0].poliza;
	document.getElementById("hidOSCEndoso").value = oItems[0].endoso;

	// Espera
	fWaitMsgBoxIni("Consultando", [ "Consultando P&oacute;liza..." ]);

	// Consulta Poliza
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var url = fGetURLSvc("BSService/getConPoliza?cache=" + fGetCacheRnd()
				+ "&compania=" + oItems[0].compania[0].id + "&poliza="
				+ oItems[0].poliza + "&endoso=" + oItems[0].endoso);
		var deferred = request.get(url, {
			handleAs : "json"
		});

		deferred.then(function(response) {
			// Manejar Respuesta
			if (response.error) {
				fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.",
						"E");
				fWaitMsgBoxClose();
				return;
			}

			var vJSONDat = response.result;

			// Si no trae nada
			if (vJSONDat == null || vJSONDat.length == 0) {
				fWaitMsgBoxUpd(0,
						"No se encontr&oacute; ning&uacute;n registro.", "W");
				fWaitMsgBoxClose();
				return;
			}

			// Datos
			fOSCDataFill(vJSONDat);

			fOSCReadOnly(false);
			// Mostrar Paneles
			dijit.byId("tpnOSCDatosPol").set("open", true);
			dijit.byId("tpnOSCDatosSin").set("open", true);
			dijit.byId("tpnOSCDatosDoc").set("open", true);
			dijit.byId("tpnOSCDatosAdj").set("open", true);

			// Cargar documentaci�n requerida
			fOSCGetDocReq();

			// Mensaje de exito
			fWaitMsgBoxUpd(0, "P&oacute;liza cargada.", "O");
			fWaitMsgBoxClose();
			dijit.byId("dlgWait").onCancel();
			dijit.byId("dlgOSCLista").onCancel();

			fMnuDeselect();
		}, function(err) {
			fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.", "E");
			fWaitMsgBoxClose();
		});
	});
}

function fOSCDataFill(vJSONDat) {
	// Campos Hidden
	document.getElementById("hidOSCProducto").value = vJSONDat.producto.id;
	document.getElementById("hidOSCTipDoc").value = vJSONDat.tipDocCod;
	document.getElementById("hidOSCNroDoc").value = vJSONDat.nroDoc;
	document.getElementById("hidOSCTomador").value = vJSONDat.tomador;
	// Datos a mostrar
	document.getElementById("txtOSCCompania").innerHTML = document
			.getElementById("hidOSCCompaniaDes").value;
	document.getElementById("txtOSCProducto").innerHTML = vJSONDat.producto.id
			+ " " + vJSONDat.producto.name;
	document.getElementById("txtOSCPoliza").innerHTML = document
			.getElementById("hidOSCPoliza").value;
	document.getElementById("txtOSCTomador").innerHTML = vJSONDat.tomador;
	document.getElementById("txtOSCDocumento").innerHTML = vJSONDat.tipDoc
			+ " " + vJSONDat.nroDoc;
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
											.getElementById("hidOSCCompania").value) {
										document
												.getElementById("hidOSCRecipientTO").value = response.result[i].email;
										break;
									}
								}
							}
						});
			});
}

function fOSCGetDocReq() {
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("ParametersService/getDenDocReqList?compania="
				+ document.getElementById("hidOSCCompania").value
				+ "&producto="
				+ document.getElementById("hidOSCProducto").value);
		var deferred = request.get(vURL, {
			handleAs : "json",
		});

		deferred.then(function(response) {
			// Manejar Respuesta
			if (response.error) {
				fWaitMsgBoxUpd(0,
						"Se ha producido un error en la consulta.(TO)", "E");
				fWaitMsgBoxClose();
				return;
			}
			var vJSON = response.result;
			// Si no trae nada
			if (vJSON == null || vJSON.length == 0) {
				fWaitMsgBoxUpd(0,
						"No se encontr&oacute; ning&uacute;n registro.", "W");
				fWaitMsgBoxClose();
				return;
			}
			// Listado de documentaci�n requerida
			var vData = {
				items : vJSON
			};
			var jsonDataSource = new ItemFileWriteStore({
				data : vData
			});

			var layout = [ [ {
				name : "Documentaci&oacute;n Requerida",
				field : "documentacion",
				width : "680px"
			} ] ];

			if (dijit.byId("dgrOSCDocList") == null) {
				oGrid = new DataGrid({
					id : "dgrOSCDocList",
					store : jsonDataSource,
					structure : layout,
					rowSelector : "25px",
					rowCount : 20,
					autoHeight : true,
					autoWidth : true,
					style : 'width: 720px; height: 100px;',
					selectionMode : "single"
				}, "_divOSCDocList");

				oGrid.startup();
			} else {
				dijit.byId("dgrOSCDocList").setStructure(layout);
				dijit.byId("dgrOSCDocList").setStore(jsonDataSource);
			}
		}, function(err) {
			fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.", "E");
			fWaitMsgBoxClose();
		});
	});
}

function fOSCTDoSel(value) {
	dijit.byId("txtOSCNroDoc").set("value", "");
	if (value == "0") {
		dijit.byId("txtOSCNroDoc").set("disabled", true);
	} else {
		dijit.byId("txtOSCNroDoc").set("disabled", false);
	}
}

function fOSCCiaSel(value) {
	dijit.byId("txtOSCPoliza").set("value", "");
	document.getElementById("lblOSCPolEjemplo").innerHTML = "";
	if (value == "0") {
		dijit.byId("txtOSCPoliza").set("disabled", true);
	} else {
		dijit.byId("txtOSCPoliza").set("disabled", false);
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
												.byId("cboOSCCompania").get(
														"value")) {
											document
													.getElementById("lblOSCPolEjemplo").innerHTML = response.result[i].ejePoliza;
											break;
										}
									}
								}
							});
				});
	}
}

function fOSCDenShow(value) {
	if (value == "N") {
		document.getElementById("trOSCDenunciante").style.display = "";
	} else {
		document.getElementById("trOSCDenunciante").style.display = "none";
	}
}

function fOSCNuevo() {
	fQstBox(
			"Est&aacute; seguro de cargar una nueva denuncia?<br/>Se perderan los cambios realizados",
			"fOSCBusDialog()");
}

function fOSCImprimir() {
	fSessionValidate('fOSCImprimirExec');
}

function fOSCImprimirExec() {
	window.open(fGetURLMVC("retrieveSvc.html?" + "cache=" + fGetCacheRnd()
			+ "&tipo=I&orden=" + document.getElementById("hidOSCOrden").value),
			"impreso", "resizable=yes,height=550,width=750,top=50,left=100");
}

function fOSCEnviar() {
	fQstBox("Est&aacute; seguro de enviar la Denuncia?",
			"fSessionValidate('fOSCEnviarExec')");
}

function fOSCEnviarExec(vUser, vProfile, vLName, vFName) {
	// Validacion
	if (dijit.byId("txtOSCFechaSiniestro").get("value") == null) {
		fMsgBox("Fecha de Siniestro inv&aacute;lida.", "Validaci&oacute;n", "E");
		return;
	}
	// Obtengo las fechas
	var vFecSin = dojo.date.locale.format(dijit.byId("txtOSCFechaSiniestro")
			.get("value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	if (vFecSin > document.getElementById("hidOSCFechaHoy").value) {
		fMsgBox("La Fecha de Siniestro no debe ser mayor a la fecha actual.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("cboOSCDenunciante").get("value") == "") {
		fMsgBox("Debe seleccionar si el denunciante es el asegurado.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("cboOSCDenunciante").get("value") == "N") {
		if (dijit.byId("cboOSCDenTipDoc").get("value") == "") {
			fMsgBox("Debe seleccionar el tipo de documento del denunciante.",
					"Validaci&oacute;n", "E");
			return;
		}
		if (isNaN(dijit.byId("txtOSCDenNroDoc").get("value"))
				|| dijit.byId("txtOSCDenNroDoc").get("value") == 0) {
			fMsgBox("Debe ingresar el Nro. de Documento del denunciante.",
					"Validaci&oacute;n", "E");
			return;
		}
		if (String(dijit.byId("txtOSCDenApellido").get("value")).length == 0) {
			fMsgBox("Debe ingresar el Apellido y Nombre del denunciante.",
					"Validaci&oacute;n", "E");
			return;
		} else {
			if (!fValType("T", dijit.byId("txtOSCDenApellido").get("value"))) {
				fMsgBox(
						"Existen caracteres no v&aacute;lidos en el Apellido y Nombre del denunciante.",
						"Validaci&oacute;n", "E");
				return;
			}
		}
		if (dijit.byId("cboOSCDenParentesco").get("value") == "") {
			fMsgBox("Debe seleccionar el Parentesco del denunciante.",
					"Validaci&oacute;n", "E");
			return;
		}
	}
	if (String(dijit.byId("txtOSCDescSiniestro").get("value")).length == 0) {
		fMsgBox("Debe ingresar la Descripci&oacute;n del Siniestro.",
				"Validaci&oacute;n", "E");
		return;
	} else {
		if (!fValType("T", dijit.byId("txtOSCDescSiniestro").get("value"))) {
			fMsgBox(
					"Existen caracteres no v&aacute;lidos en la Descripci&oacute;n del Siniestro.",
					"Validaci&oacute;n", "E");
			return;
		}
	}
	if (String(dijit.byId("txtOSCDatosSiniestro").get("value")).length == 0) {
		fMsgBox("Debe ingresar los Datos del Siniestro.", "Validaci&oacute;n",
				"E");
		return;
	} else {
		if (!fValType("T", dijit.byId("txtOSCDatosSiniestro").get("value"))) {
			fMsgBox(
					"Existen caracteres no v&aacute;lidos en los Datos del Siniestro.",
					"Validaci&oacute;n", "E");
			return;
		}
	}
	if (fOSCContAdj() == 0) {
		fMsgBox("Debe adjuntar al menos un archivo.", "Validaci&oacute;n", "E");
		return;
	}
	if (document.getElementById("txtOSCUploadF1").value != "") {
		if (document.getElementById("txtOSCUploadF1").value.substr(
				document.getElementById("txtOSCUploadF1").value.length - 4)
				.toUpperCase() != ".PDF") {
			fMsgBox("El Archivo Adjunto 1 debe ser un PDF.",
					"Validaci&oacute;n", "E");
			return;
		}
	}
	if (document.getElementById("txtOSCUploadF2").value != "") {
		if (document.getElementById("txtOSCUploadF2").value.substr(
				document.getElementById("txtOSCUploadF2").value.length - 4)
				.toUpperCase() != ".PDF") {
			fMsgBox("El Archivo Adjunto 2 debe ser un PDF.",
					"Validaci&oacute;n", "E");
			return;
		}
	}
	if (document.getElementById("txtOSCUploadF3").value != "") {
		if (document.getElementById("txtOSCUploadF3").value.substr(
				document.getElementById("txtOSCUploadF3").value.length - 4)
				.toUpperCase() != ".PDF") {
			fMsgBox("El Archivo Adjunto 3 debe ser un PDF.",
					"Validaci&oacute;n", "E");
			return;
		}
	}
	if ((document.getElementById("txtOSCUploadF1").value != "" && document
			.getElementById("txtOSCUploadF1").value == document
			.getElementById("txtOSCUploadF2").value)
			|| (document.getElementById("txtOSCUploadF1").value != "" && document
					.getElementById("txtOSCUploadF1").value == document
					.getElementById("txtOSCUploadF3").value)
			|| (document.getElementById("txtOSCUploadF2").value != "" && document
					.getElementById("txtOSCUploadF2").value == document
					.getElementById("txtOSCUploadF3").value)) {
		fMsgBox("No se puede adjuntar el mismo archivo varias veces.",
				"Validaci&oacute;n", "E");
		return;
	}

	fOSCSend(vUser, vProfile, vLName, vFName);
}

function fOSCSend(vUser, vProfile, vLName, vFName) {
	// Espera
	fWaitMsgBoxIni("Procesando...", [ "Obtener Nro Orden",
			"Adjuntar Archivo 1", "Adjuntar Archivo 2", "Adjuntar Archivo 3",
			"Guardar Denuncia", "Enviar eMail", "Confirmar Env&iacute;o",
			"Estado del Proceso" ]);
	// Verificar Paso
	if (document.getElementById("hidOSCPaso").value > "0") {
		fWaitMsgBoxUpd(0, "Ya se obtuvo el Nro Orden: "
				+ document.getElementById("hidOSCOrden").value, "I");
		fOSCPublish1();
		return;
	}
	// Guardando Denuncia
	require(
			[ "dojo/request", "dojo/domReady!" ],
			function(request) {
				fWaitMsgBoxUpd(0, "Obteniendo Nro Orden...", "A");

				var vURL = fGetURLSvc("BSService/setOpeSiniestro");
				var vPar = fOSCSendGetSave(vUser, vProfile, vLName, vFName);

				var deferred = request.post(vURL, {
					handleAs : "json",
					data : vPar
				});

				deferred
						.then(
								function(response) {
									if (response.error || !response.result) {
										fWaitMsgBoxUpd(
												0,
												"Se ha producido un error al obtener el Nro Orden.",
												"E");
										fWaitMsgBoxUpd(
												7,
												"Proceso finalizado con errores. Intente nuevamente.",
												"E");
										fWaitMsgBoxClose();
									} else if (response.result) {
										fWaitMsgBoxUpd(0,
												"Se ha obtenido el Nro Orden: "
														+ response.result, "O");
										// Publicar
										document.getElementById("hidOSCOrden").value = response.result;
										document.getElementById("hidOSCPaso").value = "1";
										fOSCPublish1();
									}
								},
								function(err) {
									fWaitMsgBoxUpd(
											0,
											"Se ha producido un error al obtener el Nro Orden.",
											"E");
									fWaitMsgBoxUpd(
											7,
											"Proceso finalizado con errores. Intente nuevamente.",
											"E");
									fWaitMsgBoxClose();
								});
			});
}

function fOSCSendGetSave(vUser, vProfile, vLName, vFName) {
	var vPar = "";

	vPar += "cache=" + fGetCacheRnd();
	vPar += "&companiaId=" + document.getElementById("hidOSCCompania").value;
	vPar += "&productoId=" + document.getElementById("hidOSCProducto").value;
	vPar += "&poliza=" + document.getElementById("hidOSCPoliza").value;
	vPar += "&endoso=" + document.getElementById("hidOSCEndoso").value;
	vPar += "&tomador="
			+ fEncodeURI(document.getElementById("hidOSCTomador").value);
	vPar += "&tipDoc=" + document.getElementById("hidOSCTipDoc").value;
	vPar += "&nroDoc=" + document.getElementById("hidOSCNroDoc").value;
	vPar += "&fechaDenuncia=" + document.getElementById("hidOSCFechaHoy").value;
	vPar += "&fechaSiniestro="
			+ dojo.date.locale.format(dijit.byId("txtOSCFechaSiniestro").get(
					"value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
	vPar += "&esDenAseg="
			+ (dijit.byId("cboOSCDenunciante").get("value") == "S" ? true
					: false);
	if (dijit.byId("cboOSCDenunciante").get("value") == "N") {
		vPar += "&denTipDoc=" + dijit.byId("cboOSCDenTipDoc").get("value");
		vPar += "&denNroDoc=" + dijit.byId("txtOSCDenNroDoc").get("value");
		vPar += "&denApeNom="
				+ fEncodeURI(dijit.byId("txtOSCDenApellido").get("value"));
		vPar += "&denParentescoId="
				+ dijit.byId("cboOSCDenParentesco").get("value");
	} else {
		vPar += "&denTipDoc=0";
		vPar += "&denNroDoc=";
		vPar += "&denApeNom=";
		vPar += "&denParentescoId=";
	}
	vPar += "&descSiniestro="
			+ fEncodeURI(dijit.byId("txtOSCDescSiniestro").get("value"));
	vPar += "&datosSiniestro="
			+ fEncodeURI(dijit.byId("txtOSCDatosSiniestro").get("value"));
	vPar += "&peopleSoft=" + vUser;
	vPar += "&usuApeNom=" + vLName + " " + vFName;

	return vPar;
}

function fOSCPublish1() {
	// Verificar Adjunto
	if (document.getElementById("txtOSCUploadF1").value == "") {
		fWaitMsgBoxUpd(1, "No se adjunta Archivo 1.", "I");
		fOSCPublish2();
		return;
	}
	// Verificar Paso
	if (document.getElementById("hidOSCPaso").value > "1") {
		fWaitMsgBoxUpd(1, "El Archivo 1 ya fue adjuntado.", "I");
		fOSCPublish2();
		return;
	}

	fWaitMsgBoxUpd(1, "Adjuntando Archivo 1...", "A");

	document.getElementById("hidOSCRetCtrl").value = "S";
	document.frmOSCUpload1.action = fGetURLMVC("publishSvc.html") + "?orden="
			+ document.getElementById("hidOSCOrden").value;
	document.frmOSCUpload1.submit();
}

function fOSCPublishRet1() {
	if (document.getElementById("hidOSCRetCtrl").value == "S") {
		document.getElementById("hidOSCRetCtrl").value = "N";
		var vIfr = document.getElementById("ifrOSCUpload1");
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
			document.getElementById("hidOSCPaso").value = "2";
			fOSCPublish2();
		}
	}
}

function fOSCPublish2() {
	// Verificar Adjunto
	if (document.getElementById("txtOSCUploadF2").value == "") {
		fWaitMsgBoxUpd(2, "No se adjunta Archivo 2.", "I");
		fOSCPublish3();
		return;
	}
	// Verificar Paso
	if (document.getElementById("hidOSCPaso").value > "2") {
		fWaitMsgBoxUpd(2, "El Archivo 2 ya fue adjuntado.", "I");
		fOSCPublish3();
		return;
	}

	fWaitMsgBoxUpd(2, "Adjuntando Archivo 2...", "A");

	document.getElementById("hidOSCRetCtrl").value = "S";
	document.frmOSCUpload2.action = fGetURLMVC("publishSvc.html") + "?orden="
			+ document.getElementById("hidOSCOrden").value;
	document.frmOSCUpload2.submit();
}

function fOSCPublishRet2() {
	if (document.getElementById("hidOSCRetCtrl").value == "S") {
		document.getElementById("hidOSCRetCtrl").value = "N";
		var vIfr = document.getElementById("ifrOSCUpload2");
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
			document.getElementById("hidOSCPaso").value = "3";
			fOSCPublish3();
		}
	}
}

function fOSCPublish3() {
	// Verificar Adjunto
	if (document.getElementById("txtOSCUploadF3").value == "") {
		fWaitMsgBoxUpd(3, "No se adjunta Archivo 3.", "I");
		fOSCSaveDen();
		return;
	}
	// Verificar Paso
	if (document.getElementById("hidOSCPaso").value > "3") {
		fWaitMsgBoxUpd(3, "El Archivo 3 ya fue adjuntado.", "I");
		fOSCSaveDen();
		return;
	}

	fWaitMsgBoxUpd(3, "Adjuntando Archivo 3...", "A");

	document.getElementById("hidOSCRetCtrl").value = "S";
	document.frmOSCUpload3.action = fGetURLMVC("publishSvc.html") + "?orden="
			+ document.getElementById("hidOSCOrden").value;
	document.frmOSCUpload3.submit();
}

function fOSCPublishRet3() {
	if (document.getElementById("hidOSCRetCtrl").value == "S") {
		document.getElementById("hidOSCRetCtrl").value = "N";
		var vIfr = document.getElementById("ifrOSCUpload3");
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
			document.getElementById("hidOSCPaso").value = "4";
			fOSCSaveDen();
		}
	}
}

function fOSCSaveDen() {
	// Verificar Paso
	if (document.getElementById("hidOSCPaso").value > "4") {
		fWaitMsgBoxUpd(4, "Ya se ha guardado la denuncia."
				+ document.getElementById("hidOSCOrden").value, "I");
		fOSCSendMail();
		return;
	}

	fWaitMsgBoxUpd(4, "Guardando Denuncia...", "A");
	// Cambiar Estado a PENDIENTE
	require(
			[ "dojo/request", "dojo/domReady!" ],
			function(request) {

				var vURL = fGetURLSvc("BSService/setOpeSiniestroEst?cache="
						+ fGetCacheRnd() + "&orden="
						+ document.getElementById("hidOSCOrden").value
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
												"Se ha producido un error al guardar la Denuncia.",
												"E");
										fWaitMsgBoxUpd(
												7,
												"Proceso finalizado con errores. Intente nuevamente.",
												"E");
										fWaitMsgBoxClose();
									} else if (response.result) {
										fWaitMsgBoxUpd(
												4,
												"La Denuncia fue guardada con &eacute;xito!",
												"O");
										document.getElementById("hidOSCPaso").value = "5";
										fOSCSendMail();
									}
								},
								function(err) {
									fWaitMsgBoxUpd(
											4,
											"Se ha producido un error al guardar la Denuncia.",
											"E");
									fWaitMsgBoxUpd(
											7,
											"Proceso finalizado con errores. Intente nuevamente.",
											"E");
									fWaitMsgBoxClose();
								});
			});
}

function fOSCSendMail() {
	// Verificar Paso
	if (document.getElementById("hidOSCPaso").value > "5") {
		fWaitMsgBoxUpd(5, "Ya se ha enviado el eMail."
				+ document.getElementById("hidOSCOrden").value, "I");
		fOSCConfEnv();
		return;
	}

	fWaitMsgBoxUpd(5, "Enviando eMail...", "A");
	// Enviar EMail
	require(
			[ "dojo/request", "dojo/domReady!" ],
			function(request) {

				var vURL = fGetURLSvc("BSService/setOpeSiniestroSendMail?cache="
						+ fGetCacheRnd()
						+ "&orden="
						+ document.getElementById("hidOSCOrden").value
						+ "&recipientTO="
						+ document.getElementById("hidOSCRecipientTO").value
						+ "&cantAdj=" + fOSCContAdj());
				var deferred = request.get(vURL, {
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
										document.getElementById("hidOSCPaso").value = "6";
										fOSCConfEnv();
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

function fOSCConfEnv() {
	fWaitMsgBoxUpd(6, "Confirmando Env&iacute;o...", "A");
	// Cambiar Estado a ENVIADO
	require(
			[ "dojo/request", "dojo/domReady!" ],
			function(request) {

				var vURL = fGetURLSvc("BSService/setOpeSiniestroEst?cache="
						+ fGetCacheRnd() + "&orden="
						+ document.getElementById("hidOSCOrden").value
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
										fOSCReadOnly(true);
										dijit.byId("btnOSCImprimir").set(
												"disabled", false);
										document.getElementById("hidOSCPaso").value = "7";
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

function fOSCContAdj() {
	var vRet = 0;
	if (document.getElementById("txtOSCUploadF1").value != "") {
		vRet++;
	}
	if (document.getElementById("txtOSCUploadF2").value != "") {
		vRet++;
	}
	if (document.getElementById("txtOSCUploadF3").value != "") {
		vRet++;
	}
	return vRet;
}

function fOSCHelpIn() {

}

function fOSCHelpOut() {

}
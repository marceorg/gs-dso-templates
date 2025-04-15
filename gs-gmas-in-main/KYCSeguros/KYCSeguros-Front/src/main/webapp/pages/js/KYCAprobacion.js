function onKAPLoad(vUser) {
	// Inicializar
	fKAPInitialize(vUser);
	// Cargar Lista
	fSessionValidate("fKAPDataLoad");
	// Tomar Parametros
	var vParID = fGetParamURL("id");
	if (vParID != "") {
		document.getElementById("hidKAPIdKYC").value = vParID.substr(3, 11);
	}
}

function fKAPInitialize(vUser) {
	// Resize
	fBrowserResize();
	// Tamaño de botones
	dojo.style("btnKAPDetalle", "width", "120px");
	dojo.style("btnKAPAprobar", "width", "120px");
	dojo.style("btnKAPRechazar", "width", "120px");
	dojo.style("btnKAPDerivar", "width", "120px");
	// Ayuda
	document.getElementById("lblKAPHelp").innerHTML = "Seleccione un KYC y haga clic en "
			+ "Detalle para consultarlo, o utilice Aprobar o Rechazar "
			+ "para realizar una de estas acciones sobre el KYC seleccionado.<br/>"
			+ "Los supervisores pueden derivar un KYC a otro supervisor haciendo clic en Derivar.";
	// Cargar Combo Supervisores
	require([ "dojo/request", "dojo/domReady!" ], function(request) {

		var vURL = fGetURLSvc("ParametersService/getSupervisorList");
		var deferred = request.get(vURL, {
			handleAs : "json"
		});

		deferred.then(function(response) {
			fComboSupLoad(response, "cboKAPDerSup", vUser);
		});
	});
}

function fKAPDataLoad(vUser, vProfileKey) {
	// Espera
	fWaitMsgBoxIni("Consultando", [ "Consultando KYC pendientes..." ]);

	var vEstadoKYC = "";
	var vPeopleSoft = "";
	if (vProfileKey == "SUPERVISOR") {
		dijit.byId("btnKAPDerivar").set("disabled", false);
		vEstadoKYC = "A";
		vPeopleSoft = vUser;
		dijit.byId("tpnKYCAprobacion").set("title",
				"Listado de KYC Por Aprobar");
	} else if (vProfileKey == "COMPLIANCE") {
		dijit.byId("btnKAPDerivar").set("disabled", true);
		vEstadoKYC = "I";
		vPeopleSoft = "";
		dijit.byId("tpnKYCAprobacion").set("title",
				"Listado de KYC Inconsistentes");
	}

	// KYC Aprobacion
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var url = fGetURLSvc("KYCService/getKYCPendienteList?cache="
				+ fGetCacheRnd() + "&estadoKYC=" + vEstadoKYC + "&profileKey="
				+ vProfileKey + "&peopleSoft=" + vPeopleSoft);
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
			var vJSON = response.result;

			// Listado KYC
			var vData = {
				items : vJSON
			};
			var jsonDataSource = new ItemFileWriteStore({
				data : vData
			});

			var layout = [ [ {
				name : "Fecha",
				field : "ultFecha",
				formatter : fDgrColFec,
				width : "70px"
			}, {
				name : "T.Persona",
				field : "tipoPersona",
				formatter : fDgrColTPe,
				width : "70px"
			}, {
				name : "CUIL/CUIT/CDI",
				field : "numeroCUIL",
				formatter : fDgrColCUI,
				width : "100px"
			}, {
				name : "Apellido, nombre / Raz&oacute;n social",
				fields : [ "tipoPersona", "apellido", "nombre" ],
				formatter : fDgrColANR,
				width : "380px"
			}, {
				name : "",
				fields : "categCliente",
				width : "1px"
			} ] ];

			if (dijit.byId("dgrKAPLista") == null) {
				oGrid = new DataGrid({
					id : "dgrKAPLista",
					store : jsonDataSource,
					structure : layout,
					rowSelector : "25px",
					rowCount : 20,
					style : 'width: 720px; height: 220px;',
					selectionMode : "single",
					onRowDblClick : function(e) {
						var vNumeroCUIL = oGrid.store.getValue(oGrid
								.getItem(e.rowIndex), "numeroCUIL");
						var vTipoPersona = oGrid.store.getValue(oGrid
								.getItem(e.rowIndex), "tipoPersona");
						fKAPSearch(vTipoPersona, vNumeroCUIL);
					}
				}, "_divKAPLista");

				oGrid.startup();
			} else {
				dijit.byId("dgrKAPLista").setStructure(layout);
				dijit.byId("dgrKAPLista").setStore(jsonDataSource);
			}

			// Mensaje de exito
			fWaitMsgBoxUpd(0, "KYC pendientes cargados.", "O");
			fWaitMsgBoxClose();
			dijit.byId("dlgWait").onCancel();

			fMnuDeselect();
		}, function(err) {
			fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.", "E");
			fWaitMsgBoxClose();
		});
	});
}

function fKAPDetalle() {
	var oGrid = dijit.byId("dgrKAPLista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un KYC para consultar.", "Advertencia", "W");
		return;
	} else {
		dojo.forEach(oItems, function(selectedItem) {
			if (selectedItem !== null) {
				fKAPSearch(selectedItem.tipoPersona, selectedItem.numeroCUIL);
			}
		});
	}
}

function fKAPAprobar() {
	fSessionValidate("fKAPAprobarExec");
}

function fKAPAprobarExec(vUser, vProfile) {
	var oGrid = dijit.byId("dgrKAPLista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un KYC para aprobar.", "Advertencia", "W");
		return;
	}
	if (document.getElementById("hidKAPIdKYC") == null
			|| (document.getElementById("hidKAPIdKYC").value != oItems[0].numeroCUIL)) {
		fMsgBox("Debe consultar el detalle del KYC antes de aprobarlo.",
				"Advertencia", "W");
		return;
	}

	document.getElementById("lblKAPComent").categCliente = oItems[0].categCliente;
	if ((oItems[0].categCliente == "13" || oItems[0].categCliente == "12")
			&& (vProfile == "COMPLIANCE")) {
		fKAPCategoriasGS(oItems[0].categCliente);
		document.getElementById("divKAPcategCli").style.display = "";
	} else {
		document.getElementById("divKAPcategCli").style.display = "none";
	}

	document.getElementById("lblKAPComent").operacion = "A";
	fQstBox("Est&aacute; seguro de Aprobar el KYC?",
			"fSessionValidate('fKAPComent')");
}

function fKAPRechazar() {
	var oGrid = dijit.byId("dgrKAPLista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un KYC para rechazar.", "Advertencia", "W");
		return;
	}

	document.getElementById("divKAPcategCli").style.display = "none";
	document.getElementById("lblKAPComent").operacion = "R";
	fQstBox("Est&aacute; seguro de Rechazar el KYC?",
			"fSessionValidate('fKAPComent')");
}

function fKAPDerivar() {
	var oGrid = dijit.byId("dgrKAPLista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un KYC para derivar.", "Advertencia", "W");
		return;
	}

	// Mostrar Dialog
	dijit.byId("cboKAPDerSup").set("value", "");
	dijit.byId("dlgKAPDerive").show();
}

function fKAPDerivarOk() {
	// Validar
	if (dijit.byId("cboKAPDerSup").get("value") == "") {
		fMsgBox("Debe seleccionar un Supervisor.", "Advertencia", "W");
		return;
	}
	dijit.byId('dlgKAPDerive').onCancel();
	fSessionValidate("fKAPDerive");
}

function fKAPComent(vUser, vProfile) {
	// Mostrar Dialog
	if (document.getElementById("lblKAPComent").operacion == "A") {
		dijit.byId("dlgKAPComent")
				.set("title", "Datos de la Aprobaci&oacute;n");
	} else if (document.getElementById("lblKAPComent").operacion == "R") {
		dijit.byId("dlgKAPComent").set("title", "Comentario del Rechazo");
	}
	document.getElementById("lblKAPComent").profile = vProfile;
	dijit.byId("txtKAPComent").set("value", "");
	dijit.byId("dlgKAPComent").show();
}

function fKAPComentOk() {
	// Validar
	if (String(dijit.byId("txtKAPComent").get("value")).length == 0) {
		// Si no tiene comentario
		if (document.getElementById("lblKAPComent").operacion == "R"
				|| (document.getElementById("lblKAPComent").operacion == "A" && document
						.getElementById("lblKAPComent").profile == "COMPLIANCE")) {
			fMsgBox("Debe ingresar un comentario.", "Advertencia", "W");
			return;
		}
	} else {
		// Si tiene comentario
		if (!fValType("T", String(dijit.byId("txtKAPComent").get("value")))) {
			fMsgBox(
					"El comentario tiene alg&uacute;n/os caracter/es inv&aacute;lido/s.",
					"Advertencia", "W");
			return;
		}
	}

	if ((document.getElementById("lblKAPComent").categCliente == "13" || document
			.getElementById("lblKAPComent").categCliente == "12")
			&& document.getElementById("lblKAPComent").operacion == "A"
			&& document.getElementById("lblKAPComent").profile == "COMPLIANCE") {
		if (dijit.byId("cboKPFCategoriaGS").get("value") == "") {
			// Si no eligio una categoria GS
			fMsgBox("Debe seleccionar una Categor&iacute;a GS.", "Advertencia",
					"W");
			return;
		}
	}

	dijit.byId('dlgKAPComent').onCancel();

	if (document.getElementById("lblKAPComent").operacion == "A") {
		fSessionValidate("fKAPApprove");
	} else if (document.getElementById("lblKAPComent").operacion == "R") {
		fSessionValidate("fKAPReject");
	}
}

function fKAPSearch(vTipoPersona, vNumeroCUIL) {
	fSessionValidate("fSessionVoid");

	var url = "";
	if (vTipoPersona == "F") {
		url = fGetURLPag("interface/KYCPersFis.html?tipoAcc=A&numeroCUIL="
				+ vNumeroCUIL + "&apellido=&nombre=");
		var oCP = dijit.byId("divContent");
		oCP.set("href", url);
		oCP.set("onDownloadEnd", function() {
			onKPFLoad();
		});
	} else if (vTipoPersona == "J") {
		url = fGetURLPag("interface/KYCPersJur.html?tipoAcc=A&numeroCUIT="
				+ vNumeroCUIL + "&razonSocial=");
		var oCP = dijit.byId("divContent");
		oCP.set("href", url);
		oCP.set("onDownloadEnd", function() {
			onKPJLoad();
		});
	}
}

function fKAPApprove(vUser, vProfileKey, vUsrApe, vUsrNom) {
	var vEstadoKYC = "";
	if (vProfileKey == "SUPERVISOR") {
		vEstadoKYC = " ";
	} else if (vProfileKey == "COMPLIANCE") {
		vEstadoKYC = "O";
	}

	var oGrid = dijit.byId("dgrKAPLista");
	var oItems = oGrid.selection.getSelected();
	var jsonDataSource = oGrid.store;
	if (oItems.length) {
		dojo
				.forEach(
						oItems,
						function(selectedItem) {
							if (selectedItem !== null) {
								require(
										[ "dojo/request", "dojo/domReady!" ],
										function(request) {

											var vURL = fGetURLSvc("KYCService/setKYCPendiente");
											var vPar = "cache="
													+ fGetCacheRnd()
													+ "&numeroCUIL="
													+ selectedItem.numeroCUIL
													+ "&tipoOperacion=C"
													+ "&estadoKYC="
													+ vEstadoKYC
													+ "&profileKey="
													+ vProfileKey
													+ "&peopleSoft="
													+ vUser
													+ "&lName="
													+ vUsrApe
													+ "&fName="
													+ vUsrNom
													+ "&primaAnual="
													+ selectedItem.primaAnual
													+ "&categCliente="
													+ selectedItem.categCliente
													+ "&categCGS="
													+ dijit
															.byId(
																	"cboKPFCategoriaGS")
															.get("value")
													+ "&comentario="
													+ fEncodeURI(dijit.byId(
															"txtKAPComent")
															.get("value"));
											var deferred = request.post(vURL, {
												handleAs : "json",
												data : vPar
											});

											deferred
													.then(function(response) {
														if (response.error
																|| response.result == null) {
															fMsgBox(
																	"Se ha producido un error al aprobar el KYC.",
																	"Error",
																	"E");
														} else if (response.result.estadoGra == 0
																&& (response.result.estadoAsi == 0 || response.result.estadoAsi == 9)) {
															var vLeyApr = "El KYC ha sido Aprobado!";
															var vIcoApr = "O";
															if (response.result.estadoKYC.codigo == "I") {
																// SiQuedoInconsistente
																vLeyApr += " pero qued&oacute; en estado "
																		+ response.result.estadoKYC.descripcion
																		+ "<br/>Requiere la aprobaci&oacute;n de COMPLIANCE.";
																vIcoApr = "W";
															}
															if (response.result.estadoAsi == 9) {
																// SiNoActualizaVigencia
																vLeyApr += "<br/>No se actualiz&oacute; la vigencia.";
																vIcoApr = "W";
															}

															// DeleteItem
															jsonDataSource
																	.deleteItem(selectedItem);
															oGrid
																	.setStore(jsonDataSource);
															oGrid.update();

															fMsgBox(
																	vLeyApr,
																	"Aprobaci&oacute;n",
																	vIcoApr);
														} else {
															fMsgBox(
																	"Se ha producido un error al aprobar el KYC.",
																	"Error",
																	"E");
														}
													},
													function(err) {
														fMsgBox(
																"Se ha producido un error al aprobar el KYC.",
																"Error",
																"E");
													});
										});
							}
						});
	}
}

function fKAPReject(vUser, vProfileKey, vUsrApe, vUsrNom) {
	var oGrid = dijit.byId("dgrKAPLista");
	var oItems = oGrid.selection.getSelected();
	var jsonDataSource = oGrid.store;
	if (oItems.length) {
		dojo
				.forEach(
						oItems,
						function(selectedItem) {
							if (selectedItem !== null) {
								require(
										[ "dojo/request", "dojo/domReady!" ],
										function(request) {
											var vURL = fGetURLSvc("KYCService/setKYCPendiente");
											var vPar = "cache="
													+ fGetCacheRnd()
													+ "&numeroCUIL="
													+ selectedItem.numeroCUIL
													+ "&tipoOperacion=C"
													+ "&estadoKYC=R"
													+ "&profileKey="
													+ vProfileKey
													+ "&peopleSoft="
													+ vUser
													+ "&lName="
													+ vUsrApe
													+ "&fName="
													+ vUsrNom
													+ "&primaAnual="
													+ selectedItem.primaAnual
													+ "&categCliente="
													+ selectedItem.categCliente
													+ "&categCGS="
													+ "&comentario="
													+ fEncodeURI(dijit.byId(
															"txtKAPComent")
															.get("value"));
											var deferred = request.post(vURL, {
												handleAs : "json",
												data : vPar
											});

											deferred
													.then(
															function(response) {
																if (response.error
																		|| response.result == null) {
																	fMsgBox(
																			"Se ha producido un error al rechazar el KYC.",
																			"Error",
																			"E");
																} else if (response.result.estadoGra == 0) {
																	// DeleteItem
																	jsonDataSource
																			.deleteItem(selectedItem);
																	oGrid
																			.setStore(jsonDataSource);
																	oGrid
																			.update();

																	fMsgBox(
																			"El KYC ha sido Rechazado",
																			"Rechazo",
																			"I");
																} else {
																	fMsgBox(
																			"Se ha producido un error al rechazar el KYC.",
																			"Error",
																			"E");
																}
															},
															function(err) {
																fMsgBox(
																		"Se ha producido un error al rechazar el KYC.",
																		"Error",
																		"E");
															});
										});
							}
						});
	}
}

function fKAPDerive(vUser, vProfileKey) {
	// Validar
	if (dijit.byId("cboKAPDerSup").get("value").split("|")[0] == vUser) {
		fMsgBox("No puede derivarse un KYC a usted mismo.", "Advertencia", "W");
		return;
	}

	var oGrid = dijit.byId("dgrKAPLista");
	var oItems = oGrid.selection.getSelected();
	var jsonDataSource = oGrid.store;
	if (oItems.length) {
		dojo
				.forEach(
						oItems,
						function(selectedItem) {
							if (selectedItem !== null) {
								require(
										[ "dojo/request", "dojo/domReady!" ],
										function(request) {
											var vURL = fGetURLSvc("KYCService/setKYCPendiente");
											var vPar = "cache="
													+ fGetCacheRnd()
													+ "&numeroCUIL="
													+ selectedItem.numeroCUIL
													+ "&tipoOperacion=R"
													+ "&estadoKYC="
													+ "&profileKey="
													+ vProfileKey
													+ "&peopleSoft="
													+ dijit
															.byId(
																	"cboKAPDerSup")
															.get("value")
															.split("|")[0]
													+ "&lName="
													+ dijit
															.byId(
																	"cboKAPDerSup")
															.get("value")
															.split("|")[1]
													+ "&fName="
													+ dijit
															.byId(
																	"cboKAPDerSup")
															.get("value")
															.split("|")[2]
													+ "&primaAnual="
													+ selectedItem.primaAnual
													+ "&categCliente="
													+ selectedItem.categCliente
													+ "&categCGS="
													+ "&comentario=";
											var deferred = request.post(vURL, {
												handleAs : "json",
												data : vPar
											});

											deferred
													.then(function(response) {
														if (response.error
																|| response.result == null) {
															fMsgBox(
																	"Se ha producido un error al derivar el KYC.",
																	"Error",
																	"E");
														} else if (response.result.estadoGra == 0) {
															// DeleteItem
															jsonDataSource
																	.deleteItem(selectedItem);
															oGrid
																	.setStore(jsonDataSource);
															oGrid.update();

															fMsgBox(
																	"El KYC ha sido Derivado!",
																	"Derivaci&oacute;n",
																	"I");
														} else {
															fMsgBox(
																	"Se ha producido un error al derivar el KYC.",
																	"Error",
																	"E");
														}
													},
													function(err) {
														fMsgBox(
																"Se ha producido un error al derivar el KYC.",
																"Error",
																"E");
													});
										});
							}
						});
	}
}

function fKAPCategoriasGS(vCodCateg) {

	// Cargar Combo Categorias GS // PPCR_2015-00142_(ENS)
	require(
			[ "dojo/request", "dojo/domReady!" ],
			function(request) {

				var vURL = fGetURLSvc("ParametersService/getCategoriasGSList?categoriaAIS="
						+ vCodCateg); // aquiedu
				var deferred = request.get(vURL, {
					handleAs : "json",
					sync : true
				});

				fComboClean("cboKPFCategoriaGS");

				deferred.then(function(response) {
					if (response.error) {
						vRet = false;
					} else {
						fComboLoad(response, "cboKPFCategoriaGS", 80);
					}
				}, function(err) {
					vRet = false;
				});
			});
}

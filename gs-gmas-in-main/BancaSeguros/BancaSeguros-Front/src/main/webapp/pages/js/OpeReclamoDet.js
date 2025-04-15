function onORDLoad() {
	// Inicializar
	fORDInitialize();
	// Tomar parametro
	var vParOrd = fGetParamURL("orden");
	document.getElementById("hidORDOrden").value = vParOrd;
	// Parametros para volver
	var vParTIn = fGetParamURL("tipoInforme");
	document.getElementById("hidORDTipoInforme").value = vParTIn;
	if (vParTIn == "tipoInforme=ORS") {
		var vParFDe = fGetParamURL("fechaDesde");
		var vParFHa = fGetParamURL("fechaHasta");
		var vParCia = fGetParamURL("compania");
		var vParTDo = fGetParamURL("tipDoc");
		var vParNDo = fGetParamURL("nroDoc");
		var vParApe = fGetParamURL("apellido");
		var vParPol = fGetParamURL("poliza");
		var vParOrd = fGetParamURL("ordenPar");
		var vParEst = fGetParamURL("estado");
		var vParPSt = fGetParamURL("paramStart");
		document.getElementById("hidORDFechaDesde").value = vParFDe;
		document.getElementById("hidORDFechaHasta").value = vParFHa;
		document.getElementById("hidORDCompania").value = vParCia;
		document.getElementById("hidORDTipDoc").value = vParTDo;
		document.getElementById("hidORDNroDoc").value = vParNDo;
		document.getElementById("hidORDApellido").value = vParApe;
		document.getElementById("hidORDPoliza").value = vParPol;
		document.getElementById("hidORDOrdenPar").value = vParOrd;
		document.getElementById("hidORDEstado").value = vParEst;
		document.getElementById("hidORDParamStart").value = vParPSt;
	}
	fSessionValidate('fORDDataLoad');
}

function fORDInitialize() {
	// Resize
	fBrowserResize();
	// Tama?o de botones
	dojo.style("btnORDImprimir", "width", "120px");
	dojo.style("btnORDEnviar", "width", "120px");
}

function fORDDataLoad() {
	// Espera
	fWaitMsgBoxIni("Consultando", [ "Consultando Pedido..." ]);

	// Consulta Pedido
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var url = fGetURLSvc("BSService/getOpeReclamo?cache=" + fGetCacheRnd()
				+ "&" + document.getElementById("hidORDOrden").value);
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

			var vJSON = response.result;

			// Si no trae nada
			if (vJSON == null || !vJSON.jsonResult) {
				fWaitMsgBoxUpd(0,
						"Se ha producido un error en la consulta. (AS)", "E");
				fWaitMsgBoxClose();
				return;
			}

			var vJSONDat = fJSONParse(vJSON.jsonResult);

			if (vJSONDat == null || vJSONDat.length == 0) {
				fWaitMsgBoxUpd(0,
						"No se encontr&oacute; ning&uacute;n registro.", "W");
				fWaitMsgBoxClose();
				return;
			}

			// Datos
			fORDDataFill(vJSONDat);

			// Mensaje de exito
			fWaitMsgBoxUpd(0, "Pedido cargado.", "O");
			fWaitMsgBoxClose();
			dijit.byId("dlgWait").onCancel();

			fMnuDeselect();
		}, function(err) {
			fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.", "E");
			fWaitMsgBoxClose();
		});
	});
}

function fORDDataFill(vJSONDat) {
	// Datos a mostrar
	document.getElementById("hidORDCompaniaCod").value = vJSONDat.CIAASCOD;
	document.getElementById("txtORDCompania").innerHTML = fNomCia(vJSONDat.CIAASCOD);
	var vNomProd = fNomProd(vJSONDat.RAMO);
	document.getElementById("txtORDProducto").innerHTML = vJSONDat.RAMO + " "
			+ vNomProd;
	document.getElementById("hidORDEndoso").value = vJSONDat.ENDOSO;
	document.getElementById("txtORDEndoso").innerHTML = vJSONDat.ENDOSO;
	document.getElementById("txtORDPoliza").innerHTML = vJSONDat.POLIZA;
	document.getElementById("txtORDTomador").innerHTML = vJSONDat.APEYNOM;
	var vNomTiDo = fNomTD(vJSONDat.TIPODOC);
	document.getElementById("txtORDDocumento").innerHTML = vNomTiDo + " "
			+ vJSONDat.NRODOC;
	document.getElementById("hidORDNomTDoc").value = vNomTiDo;
	document.getElementById("hidORDNumeroDoc").value = vJSONDat.NRODOC;
	document.getElementById("txtORDOrden").innerHTML = document
			.getElementById("hidORDOrden").value.substr(6, 10);
	document.getElementById("txtORDEstado").innerHTML = fSinEstadoDen(vJSONDat.ESTADO);
	document.getElementById("hidORDEstadoCod").value = vJSONDat.ESTADO;
	document.getElementById("txtORDFechaReclamo").innerHTML = fDgrColFec(vJSONDat.FECHA);
	document.getElementById("hidORDFechaReclamo").value = vJSONDat.FECHA;
	document.getElementById("txtORDTipoReg").innerHTML = vJSONDat.DESCTIPOREC;
	document.getElementById("txtORDMotReg").innerHTML = vJSONDat.DESCMOTIVOREC;
	dijit.byId("txtORDDescReclamo").set("value", vJSONDat.DESCREC);
	dijit.byId("txtORDCliTelefono").set("value", vJSONDat.TELEFONO);
	dijit.byId("txtORDCliEmail").set("value", vJSONDat.EMAIL);
	document.getElementById("txtORDUsuario").innerHTML = vJSONDat.PEOPLESOFT
			+ " - " + vJSONDat.USUARNOMB;
	// Ver si tiene archivos adjuntos
	fORDBuscaAdj();
}

function fNomProd(vRamo) {
	var vNomRamo = "";
	require([ "dojo/request", "dojo/domReady!" ], function(request) {

		var vURL = fGetURLSvc("ParametersService/getProductoList?compania="
				+ document.getElementById("hidORDCompaniaCod").value);
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});

		deferred.then(function(response) {
			if (!response.error) {
				for ( var i in response.result) {
					if (String(response.result[i].id) == vRamo) {
						vNomRamo = response.result[i].name;
						break;
					}
				}
			}
		});
	});
	return vNomRamo;
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

function fNomTD(vNroTD) {
	var vNomTD = "";
	require([ "dojo/request", "dojo/domReady!" ], function(request) {

		var vURL = fGetURLSvc("ParametersService/getTipoDocList");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});

		deferred.then(function(response) {
			if (!response.error) {
				for ( var i in response.result) {
					if (String(response.result[i].id) == vNroTD) {
						vNomTD = response.result[i].name;
						break;
					}
				}
			}
		});
	});
	return vNomTD;
}

function fORDBuscaAdj() {
	var vAdj1 = false;
	var vAdj2 = false;
	var vAdj3 = false;

	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var url = fGetURLSvc("BSService/getReclamoAdj?cache=" + fGetCacheRnd()
				+ "&" + document.getElementById("hidORDOrden").value);
		var deferred = request.get(url, {
			handleAs : "json"
		});

		deferred.then(function(response) {
			if (!response.error) {
				if (String(response.result.ret) == "100") {
					vAdj1 = true;
				} else if (String(response.result.ret) == "110") {
					vAdj1 = true;
					vAdj2 = true;
				} else if (String(response.result.ret) == "111") {
					vAdj1 = true;
					vAdj2 = true;
					vAdj3 = true;
				}
			}
		});
	});

	dijit.byId("btnORDVerAdj1").set("disabled", !vAdj1);
	dijit.byId("btnORDVerAdj2").set("disabled", !vAdj2);
	dijit.byId("btnORDVerAdj3").set("disabled", !vAdj3);

	// Adjuntos jose
	if (fORDContAdj() > 0) {
		document.getElementById("trORDArchAdj").style.display = "";
		document.getElementById("trORDArchNoFound").style.display = "none";
	} else {
		document.getElementById("trORDArchAdj").style.display = "none";
		document.getElementById("trORDArchNoFound").style.display = "";
	}
}

function fORDImprimir() {
	fSessionValidate('fORDImprimirExec');
}

function fORDImprimirExec() {
	window.open(fGetURLMVC("retrieveSvc.html?" + "cache=" + fGetCacheRnd()
			+ "&tipo=R&" + document.getElementById("hidORDOrden").value
			+ "&compania="
			+ document.getElementById("txtORDCompania").innerHTML
			+ "&producto="
			+ document.getElementById("txtORDProducto").innerHTML + "&poliza="
			+ document.getElementById("txtORDPoliza").innerHTML + "&endoso="
			+ document.getElementById("hidORDEndoso").value + "&tomador="
			+ fEncodeURI(document.getElementById("txtORDTomador").innerHTML)
			+ "&tipDoc=" + document.getElementById("hidORDNomTDoc").value
			+ "&nroDoc=" + document.getElementById("hidORDNumeroDoc").value
			+ "&fechaPedido="
			+ document.getElementById("hidORDFechaReclamo").value + "&tipReg="
			+ document.getElementById("txtORDTipoReg").innerHTML + "&motRec="
			+ document.getElementById("txtORDMotReg").innerHTML + "&descRec="
			+ fEncodeURI(dijit.byId("txtORDDescReclamo").get("value"))
			+ "&telefono="
			+ fEncodeURI(dijit.byId("txtORDCliTelefono").get("value"))
			+ "&email=" + fEncodeURI(dijit.byId("txtORDCliEmail").get("value"))
			+ "&peopleSoft="
			+ document.getElementById("txtORDUsuario").innerHTML), "impreso",
			"resizable=yes,height=550,width=750,top=50,left=100");
}

function fORDEnviar() {
	fORDGetMail();
	fQstBox(
			"Est&aacute; seguro de volver a enviar el eMail<br/>del Pedido a la Compa&ntilde;&iacute;a?",
			"fSessionValidate('fORDSendMail')");
}

function fORDSendMail() {
	if (document.getElementById("hidORDEstadoCod").value != "P") {
		fWaitMsgBoxIni("Env&iacute;o eMail", [ "Enviando eMail..." ]);
	} else {
		fWaitMsgBoxIni("Procesando...", [ "Enviando eMail...",
				"Confirmar Env&iacute;o" ]);
	}
	// Enviar EMail
	require(
			[ "dojo/request", "dojo/domReady!" ],
			function(request) {

				var vURL = fGetURLSvc("BSService/setOpeReclamoSendMail?cache="
						+ fGetCacheRnd()
						+ "&"
						+ document.getElementById("hidORDOrden").value
						+ "&recipientTO="
						+ document.getElementById("hidORDRecipientTO").value
						+ "&cantAdj="
						+ fORDContAdj()
						+ "&compania="
						+ document.getElementById("txtORDCompania").innerHTML
						+ "&producto="
						+ document.getElementById("txtORDProducto").innerHTML
						+ "&poliza="
						+ document.getElementById("txtORDPoliza").innerHTML
						+ "&endoso="
						+ document.getElementById("hidORDEndoso").value
						+ "&tomador="
						+ fEncodeURI(document.getElementById("txtORDTomador").innerHTML)
						+ "&tipDoc="
						+ document.getElementById("hidORDNomTDoc").value
						+ "&nroDoc="
						+ document.getElementById("hidORDNumeroDoc").value
						+ "&fechaPedido="
						+ document.getElementById("hidORDFechaReclamo").value
						+ "&tipReg="
						+ document.getElementById("txtORDTipoReg").innerHTML
						+ "&motRec="
						+ document.getElementById("txtORDMotReg").innerHTML
						+ "&descRec="
						+ fEncodeURI(dijit.byId("txtORDDescReclamo").get(
								"value"))
						+ "&telefono="
						+ fEncodeURI(dijit.byId("txtORDCliTelefono").get(
								"value")) + "&email="
						+ fEncodeURI(dijit.byId("txtORDCliEmail").get("value"))
						+ "&peopleSoft="
						+ document.getElementById("txtORDUsuario").innerHTML);
				var deferred = request.post(vURL, {
					handleAs : "json"
				});

				deferred
						.then(
								function(response) {
									if (response.error || !response.result) {
										fWaitMsgBoxUpd(
												0,
												"Se ha producido un error al enviar el email.",
												"E");
										fWaitMsgBoxClose();
									} else if (response.result) {
										fWaitMsgBoxUpd(
												0,
												"El email fue enviado con &eacute;xito!",
												"O");
										// Solo para estado P (pendientes)
										if (document
												.getElementById("hidORDEstadoCod").value == "P") {
											// Cambiar Estado a ENVIADO
											fWaitMsgBoxUpd(
													1,
													"Confirmando Env&iacute;o...",
													"A");
											require(
													[ "dojo/request",
															"dojo/domReady!" ],
													function(request) {

														var vURL = fGetURLSvc("BSService/setOpeReclamoEst?cache="
																+ fGetCacheRnd()
																+ "&"
																+ document
																		.getElementById("hidORDOrden").value
																+ "&estado=E");
														var deferred = request
																.get(
																		vURL,
																		{
																			handleAs : "json"
																		});

														deferred
																.then(
																		function(
																				response) {
																			if (response.error
																					|| !response.result) {
																				fWaitMsgBoxUpd(
																						1,
																						"Se ha producido un error al confirmar el env&iacute;o.",
																						"E");
																				fWaitMsgBoxClose();
																			} else if (response.result) {
																				document
																						.getElementById("txtORDEstado").innerHTML = fSinEstadoDen("E");
																				fWaitMsgBoxUpd(
																						1,
																						"El env&iacute;o se ha confirmado con &eacute;xito!",
																						"O");
																				fWaitMsgBoxClose();
																			}
																		},
																		function(
																				err) {
																			fWaitMsgBoxUpd(
																					1,
																					"Se ha producido un error al confirmar el env&iacute;o.",
																					"E");
																			fWaitMsgBoxClose();
																		});
													});
										} else {
											fWaitMsgBoxClose();
										}
									}
								},
								function(err) {
									fWaitMsgBoxUpd(
											0,
											"Se ha producido un error al enviar el email.",
											"E");
									fWaitMsgBoxClose();
								});
			});
}

function fORDGetMail() {
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
											.getElementById("hidORDCompaniaCod").value) {
										document
												.getElementById("hidORDRecipientTO").value = response.result[i].recemail;
										break;
									}
								}
							}
						});
			});
}

function fORDContAdj() {
	var vRet = 0;
	if (!dijit.byId("btnORDVerAdj1").get("disabled")) {
		vRet++;
	}
	if (!dijit.byId("btnORDVerAdj2").get("disabled")) {
		vRet++;
	}
	if (!dijit.byId("btnORDVerAdj3").get("disabled")) {
		vRet++;
	}
	return vRet;
}

function fORDVerAdj1() {
	fORDVerAdj("1");
}

function fORDVerAdj2() {
	fORDVerAdj("2");
}

function fORDVerAdj3() {
	fORDVerAdj("3");
}

function fORDVerAdj(vArchAdj) {
	// para utilizar el repositorio de coldview de denuncia, se suma 10000 al
	// nro. de orden para que no de duplicado
	var ordenCV = parseInt(document.getElementById("hidORCOrden").value) + 10000;
	window.open(fGetURLMVC("retrieveSvc.html?" + "cache=" + fGetCacheRnd()
			+ "&tipo=A&" + ordenCV + "&archAdj=" + vArchAdj), "impreso",
			"resizable=yes,height=550,width=750,top=50,left=100");
}

function fORDVolver() {
	fSessionValidate("fORDBack");
}

function fORDBack() {
	if (document.getElementById("hidORDTipoInforme").value == "tipoInforme=ORS") {
		url = fGetURLPag("interface/OpeReclamoSeg.html?"
				+ document.getElementById("hidORDFechaDesde").value + "&"
				+ document.getElementById("hidORDFechaHasta").value + "&"
				+ document.getElementById("hidORDCompania").value + "&"
				+ document.getElementById("hidORDTipDoc").value + "&"
				+ document.getElementById("hidORDNroDoc").value + "&"
				+ document.getElementById("hidORDApellido").value + "&"
				+ document.getElementById("hidORDPoliza").value + "&"
				+ document.getElementById("hidORDOrdenPar").value + "&"
				+ document.getElementById("hidORDEstado").value + "&"
				+ document.getElementById("hidORDParamStart").value);
		var oCP = dijit.byId("divContent");
		oCP.set("href", url);
		oCP.set("onDownloadEnd", function() {
			onORSLoad();
		});
	}
}
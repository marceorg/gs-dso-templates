/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.service.utils;

import java.util.ArrayList;
import java.util.List;

import com.hsbc.hbar.bancaseg.model.bs.Cliente;
import com.hsbc.hbar.bancaseg.model.bs.ConCliente;
import com.hsbc.hbar.bancaseg.model.bs.ConEndoso;
import com.hsbc.hbar.bancaseg.model.bs.ConSiniestro;
import com.hsbc.hbar.bancaseg.model.bs.Denuncia;
import com.hsbc.hbar.bancaseg.model.bs.OpeEmitida;
import com.hsbc.hbar.bancaseg.model.bs.Poliza;
import com.hsbc.hbar.bancaseg.model.bs.Siniestro;
import com.hsbc.hbar.bancaseg.model.common.AsegAdic;
import com.hsbc.hbar.bancaseg.model.common.Asegurado;
import com.hsbc.hbar.bancaseg.model.common.Auxiliar;
import com.hsbc.hbar.bancaseg.model.common.Beneficiario;
import com.hsbc.hbar.bancaseg.model.common.Canal;
import com.hsbc.hbar.bancaseg.model.common.Cobertura;
import com.hsbc.hbar.bancaseg.model.common.Compania;
import com.hsbc.hbar.bancaseg.model.common.Contacto;
import com.hsbc.hbar.bancaseg.model.common.DenDocReq;
import com.hsbc.hbar.bancaseg.model.common.Endoso;
import com.hsbc.hbar.bancaseg.model.common.Parentesco;
import com.hsbc.hbar.bancaseg.model.common.Producto;
import com.hsbc.hbar.bancaseg.model.common.Riesgo;
import com.hsbc.hbar.bancaseg.model.common.SinCobertura;
import com.hsbc.hbar.bancaseg.model.common.SinDetalle;
import com.hsbc.hbar.bancaseg.model.common.SinEstado;
import com.hsbc.hbar.bancaseg.model.common.SinPago;
import com.hsbc.hbar.bancaseg.model.common.Sucursal;
import com.hsbc.hbar.bancaseg.model.constant.MessageConstants;

public class MsgFormatter {
	// Get Estado de respuesta
	public static String getEstado(final String response) {
		String estado = "ER";
		if (response.length() > 6) {
			estado = response.substring(4, 6);
		}
		return estado;
	}

	// Set Header
	private static String setHeader(final String numeroMsg, final String tipo) {
		String header = "";
		header = numeroMsg + tipo + "  ";
		return header;
	}

	// Set Field
	private static String setField(final String request, final String tipo, final Integer tamano) {
		return setField(request, tipo, tamano, 0);
	}

	private static String setField(final String request, final String tipo, final Integer tamano, final Integer decimales) {
		StringBuffer sBuf = new StringBuffer();
		String field = "";
		if (tipo.equalsIgnoreCase(MessageConstants.MSG_TYPE_STRING)) {
			field = String.format("%1$-" + tamano + "s", UtilFormat.setCharsAIS(request));
		} else if (tipo.equalsIgnoreCase(MessageConstants.MSG_TYPE_NUMERIC)) {
			field = String.format("%0" + tamano + "d", Long.parseLong(request));
		} else if (tipo.equalsIgnoreCase(MessageConstants.MSG_TYPE_DECIMAL)) {
			sBuf.append(String.format("%0" + (tamano - decimales) + "d",
					Long.parseLong(request.substring(0, request.indexOf(".")))));
			sBuf.append(((request.substring(request.indexOf(".") + 1, request.length())) + String.format("%0" + decimales
					+ "d", 0)).substring(0, decimales));
			field = sBuf.toString();
		} else if (tipo.equalsIgnoreCase(MessageConstants.MSG_TYPE_DATE)) {
			field = String.format("%0" + tamano + "d", Long.parseLong(request));
		}
		return field;
	}

	// Get Field
	private static String getField(final String response, final String tipo, final Auxiliar inicio, final Integer tamano) {
		return getField(response, tipo, inicio, tamano, 0);
	}

	private static String getField(final String response, final String tipo, final Auxiliar inicio, final Integer tamano,
			final Integer decimales) {
		String field = "";
		if (tipo.equalsIgnoreCase(MessageConstants.MSG_TYPE_STRING)) {
			field = UtilFormat.getCharsAIS(response.substring(inicio.getNumber(), inicio.getNumber() + tamano).trim());
		} else if (tipo.equalsIgnoreCase(MessageConstants.MSG_TYPE_NUMERIC)) {
			field = response.substring(inicio.getNumber(), inicio.getNumber() + tamano);
		} else if (tipo.equalsIgnoreCase(MessageConstants.MSG_TYPE_DECIMAL)) {
			String fieldT = "";
			fieldT = response.substring(inicio.getNumber(), inicio.getNumber() + tamano);
			field = fieldT.substring(0, fieldT.length() - decimales) + "."
					+ fieldT.substring(fieldT.length() - decimales, fieldT.length());
		} else if (tipo.equalsIgnoreCase(MessageConstants.MSG_TYPE_DATE)) {
			field = response.substring(inicio.getNumber(), inicio.getNumber() + tamano);
		}
		inicio.setNumber(inicio.getNumber() + tamano);
		return field;
	}

	// Get OpeEmitida List (Request)
	public static String reqMFGetOpeEmitidaList(final Integer fechaDesde, final Integer fechaHasta, final Integer compania,
			final String producto, final String paramStart) {
		StringBuffer reqMF = new StringBuffer();
		String vTipo = "  ";
		if (!paramStart.equals("")) {
			vTipo = "TR";
		}
		reqMF.append(setHeader(MessageConstants.MSG_COEL_MESSAGEID, vTipo));
		reqMF.append(setField(compania.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_COEL_COMPANIA));
		reqMF.append(setField(producto, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_COEL_PRODUCTO));
		reqMF.append(setField(fechaDesde.toString(), MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_COEL_FECHADESDE));
		reqMF.append(setField(fechaHasta.toString(), MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_COEL_FECHAHASTA));
		reqMF.append(setField(paramStart, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_COEL_PARAMSTART));
		return reqMF.toString();
	}

	// Get OpeEmitida List (Response)
	public static List<OpeEmitida> resMFGetOpeEmitidaList(final String response) {
		List<OpeEmitida> opeEmitidaList = null;

		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_COEL_INI);
		opeEmitidaList = new ArrayList<OpeEmitida>();
		Integer cantReg = Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_COEL_CANTREG));
		for (int i = 0; i < cantReg; i++) {
			OpeEmitida opeEmitida = new OpeEmitida();
			Compania compania = new Compania();
			compania.setId(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
					MessageConstants.MSG_RES_COEL_COMPANIA)));
			opeEmitida.setCompania(compania);
			opeEmitida.setPoliza(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_COEL_POLIZA));
			opeEmitida.setEndoso(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
					MessageConstants.MSG_RES_COEL_ENDOSO)));
			opeEmitida.setTomador(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_COEL_TOMADOR));
			opeEmitida.setVigenciaDesde(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_COEL_VIGENCIADESDE)));
			opeEmitida.setVigenciaHasta(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_COEL_VIGENCIAHASTA)));
			opeEmitida.setFechaEmision(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_COEL_FECHAEMISION)));
			String primaSig = getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_COEL_PRIMA_SIG);
			opeEmitida.setPrima(Double.parseDouble(getField(response, MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
					MessageConstants.MSG_RES_COEL_PRIMA, MessageConstants.MSG_RES_COEL_PRIMA_DEC)));
			if (primaSig.equals("-")) {
				opeEmitida.setPrima(opeEmitida.getPrima() * -1);
			}
			String precioSig = getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_COEL_PRECIO_SIG);
			opeEmitida.setPrecio(Double.parseDouble(getField(response, MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
					MessageConstants.MSG_RES_COEL_PRECIO, MessageConstants.MSG_RES_COEL_PRECIO_DEC)));
			if (precioSig.equals("-")) {
				opeEmitida.setPrecio(opeEmitida.getPrecio() * -1);
			}
			opeEmitida.setMotivo(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_COEL_MOTIVO));

			opeEmitida.setProducto(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_COEL_PRODUCTO));

			opeEmitidaList.add(opeEmitida);
		}

		return opeEmitidaList;
	}

	// Get ConCliente List (Request)
	public static String reqMFGetConClienteList(final String tipoBusqueda, final Integer tipDoc, final String nroDoc,
			final String apellido, final Integer compania, final String poliza, final String paramStart) {
		StringBuffer reqMF = new StringBuffer();
		String vTipo = "  ";
		if (!paramStart.equals("")) {
			vTipo = "TR";
		}
		reqMF.append(setHeader(MessageConstants.MSG_CCLL_MESSAGEID, vTipo));
		reqMF.append(setField(tipoBusqueda, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_CCLL_TIPOBUSQUEDA));
		reqMF.append(setField(tipDoc.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_CCLL_TIPDOC));
		reqMF.append(setField(nroDoc, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_CCLL_NRODOC));
		reqMF.append(setField(apellido, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_CCLL_APELLIDO));
		reqMF.append(setField(compania.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_CCLL_COMPANIA));
		reqMF.append(setField(poliza, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_CCLL_POLIZA));
		reqMF.append(setField(paramStart, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_COEL_PARAMSTART));
		return reqMF.toString();
	}

	// Get ConCliente List (Response)
	public static List<ConCliente> resMFGetConClienteList(final String response) {
		List<ConCliente> conClienteList = null;

		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_CCLL_INI);
		conClienteList = new ArrayList<ConCliente>();
		Integer cantReg = Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CCLL_CANTREG));
		for (int i = 0; i < cantReg; i++) {
			ConCliente conCliente = new ConCliente();
			Compania compania = new Compania();
			compania.setId(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
					MessageConstants.MSG_RES_CCLL_COMPANIA)));
			conCliente.setCompania(compania);
			conCliente.setPoliza(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_CCLL_POLIZA));
			conCliente.setEndoso(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
					MessageConstants.MSG_RES_CCLL_ENDOSO)));
			conCliente.setTomador(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_CCLL_TOMADOR));
			conCliente.setEstado(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_CCLL_ESTADO));
			conCliente.setProducto(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_CCLL_PRODUCTO));

			conClienteList.add(conCliente);
		}

		return conClienteList;
	}

	// Get ConCliente (Request)
	public static String reqMFGetConCliente(final Integer compania, final String poliza) {
		StringBuffer reqMF = new StringBuffer();
		String vTipo = "  ";
		reqMF.append(setHeader(MessageConstants.MSG_CCLI_MESSAGEID, vTipo));
		reqMF.append(setField(compania.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_CCLI_COMPANIA));
		reqMF.append(setField(poliza, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_CCLI_POLIZA));
		return reqMF.toString();
	}

	// Get ConCliente (Response)
	public static Cliente resMFGetConCliente(final String response) {
		Cliente cliente = new Cliente();
		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_CCLI_INI);
		cliente.setTomador(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CCLI_TOMADOR));
		cliente.setTipDoc(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CCLI_TIPDOC));
		cliente.setNroDoc(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CCLI_NRODOC));
		cliente.setSexo(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion, MessageConstants.MSG_RES_CCLI_SEXO));
		cliente.setFechaNacimiento(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CCLI_FECHANACIMIENTO)));
		cliente.setNacionalidad(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CCLI_NACIONALIDAD));
		cliente.setEstadoCivil(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CCLI_ESTADOCIVIL));
		cliente.setDomicilio(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CCLI_DOMICILIO));
		cliente.setCodPost(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CCLI_CODPOST));
		cliente.setLocalidad(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CCLI_LOCALIDAD));
		cliente.setProvincia(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CCLI_PROVINCIA));
		Integer cantCont = Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CCLI_CANTCONT));
		List<Contacto> contactoList = new ArrayList<Contacto>();
		for (int i = 0; i < cantCont; i++) {
			Contacto contacto = new Contacto();
			contacto.setMedio(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_CCLI_CONTMEDIO));
			contacto.setDescripcion(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_CCLI_CONTDESCRIPCION));

			contactoList.add(contacto);
		}
		cliente.setContactoList(contactoList);

		return cliente;
	}

	// Get Poliza (Request)
	public static String reqMFGetConPoliza(final Integer compania, final String poliza, final Integer endoso) {
		StringBuffer reqMF = new StringBuffer();
		String vTipo = "  ";
		reqMF.append(setHeader(MessageConstants.MSG_CPOL_MESSAGEID, vTipo));
		reqMF.append(setField(compania.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_CPOL_COMPANIA));
		reqMF.append(setField(poliza, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_CPOL_POLIZA));
		reqMF.append(setField(endoso.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_CPOL_ENDOSO));
		return reqMF.toString();
	}

	// Get Poliza (Response)
	public static Poliza resMFGetConPoliza(final String response) {
		Poliza poliza = new Poliza();
		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_CPOL_INI);
		Producto producto = new Producto();
		producto.setId(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_PRODUCTO));
		poliza.setProducto(producto);
		Sucursal sucursal = new Sucursal();
		sucursal.setId(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_SUCURSAL));
		poliza.setSucursal(sucursal);
		Canal canal = new Canal();
		canal.setId(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion, MessageConstants.MSG_RES_CPOL_CANAL));
		poliza.setCanal(canal);
		poliza.setTomador(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_TOMADOR));
		poliza.setTipDoc(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_TIPDOC));
		poliza.setTipDocCod(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CPOL_TIPDOCCOD)));
		poliza.setNroDoc(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_NRODOC));
		poliza.setFechaEmision(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CPOL_FECHAEMISION)));
		poliza.setEstado(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_ESTADO));
		poliza.setVendedorLegajo(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_VENDEDORLEGAJO));
		poliza.setVendedorNombre(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_VENDEDORNOMBRE));
		poliza.setPremio(Double.parseDouble(getField(response, MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
				MessageConstants.MSG_RES_CPOL_PREMIO, MessageConstants.MSG_RES_CPOL_PREMIO_DEC)));
		poliza.setVigenciaDesde(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CPOL_VIGENCIADESDE)));
		poliza.setVigenciaHasta(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CPOL_VIGENCIAHASTA)));
		poliza.setFechaRegistracion(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CPOL_FECHAREGISTRACION)));
		poliza.setOrden(Long.parseLong(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CPOL_ORDEN)));
		poliza.setCanalCobro(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_CANALCOBRO));
		poliza.setTipCta(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_TIPCTA));
		poliza.setNroCta(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_NROCTA));
		poliza.setCampana(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_CAMPANA));
		Integer cantAseg = Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CPOL_CANTASEG));
		Asegurado asegurado = new Asegurado();
		asegurado.setNombre(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_ASEGNOMBRE));
		asegurado.setTipDoc(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_ASEGTIPDOC));
		asegurado.setNroDoc(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_ASEGNRODOC));
		asegurado.setDomicilio(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_ASEGDOMICILIO));
		asegurado.setCodPost(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_ASEGCODPOST));
		asegurado.setLocalidad(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_ASEGLOCALIDAD));
		asegurado.setProvincia(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_ASEGPROVINCIA));
		poliza.setAsegurado(asegurado);
		Integer cantAsegAdic = Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CPOL_CANTASEGADIC));
		List<AsegAdic> asegAdicList = new ArrayList<AsegAdic>();
		for (int i = 0; i < MessageConstants.MSG_RES_CPOL_ASEGADICLIST; i++) {
			if (i < cantAsegAdic) {
				AsegAdic asegAdic = new AsegAdic();
				asegAdic.setNombre(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CPOL_ASEGADICNOMBRE));
				asegAdic.setTipDoc(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CPOL_ASEGADICTIPDOC));
				asegAdic.setNroDoc(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CPOL_ASEGADICNRODOC));
				asegAdicList.add(asegAdic);
			} else {
				String asegAdicFil = getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CPOL_ASEGADICNOMBRE + MessageConstants.MSG_RES_CPOL_ASEGADICTIPDOC
								+ MessageConstants.MSG_RES_CPOL_ASEGADICNRODOC);
			}
		}
		poliza.setAsegAdicList(asegAdicList);
		poliza.setLeyeBeneficiario(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CPOL_LEYEBENEF));
		Integer cantBenef = Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CPOL_CANTBENEF));
		List<Beneficiario> beneficiarioList = new ArrayList<Beneficiario>();
		for (int i = 0; i < MessageConstants.MSG_RES_CPOL_BENEFLIST; i++) {
			if (i < cantBenef) {
				Beneficiario beneficiario = new Beneficiario();
				beneficiario.setOrden(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
						MessageConstants.MSG_RES_CPOL_BENEFORDEN)));
				beneficiario.setNombre(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CPOL_BENEFNOMBRE));
				beneficiario.setTipDoc(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CPOL_BENEFTIPDOC));
				beneficiario.setNroDoc(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CPOL_BENEFNRODOC));
				beneficiario.setPorcentaje(Double.parseDouble(getField(response, MessageConstants.MSG_TYPE_DECIMAL,
						auxPosicion, MessageConstants.MSG_RES_CPOL_BENEFPORC, MessageConstants.MSG_RES_CPOL_BENEFPORC_DEC)));
				beneficiarioList.add(beneficiario);
			} else {
				String beneficiarioFil = getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CPOL_BENEFORDEN + MessageConstants.MSG_RES_CPOL_BENEFNOMBRE
								+ MessageConstants.MSG_RES_CPOL_BENEFTIPDOC + MessageConstants.MSG_RES_CPOL_BENEFNRODOC
								+ MessageConstants.MSG_RES_CPOL_BENEFPORC);
			}
		}
		poliza.setBeneficiarioList(beneficiarioList);
		Integer cantCob = Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CPOL_CANTCOB));
		List<Cobertura> coberturaList = new ArrayList<Cobertura>();
		for (int i = 0; i < MessageConstants.MSG_RES_CPOL_COBLIST; i++) {
			if (i < cantCob) {
				Cobertura cobertura = new Cobertura();
				cobertura.setDescripcion(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CPOL_COBDESCRIPCION));
				cobertura.setSumaAseg(Double.parseDouble(getField(response, MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
						MessageConstants.MSG_RES_CPOL_COBSUMAASEG, MessageConstants.MSG_RES_CPOL_COBSUMAASEG_DEC)));
				coberturaList.add(cobertura);
			} else {
				String coberturaFil = getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CPOL_COBDESCRIPCION + MessageConstants.MSG_RES_CPOL_COBSUMAASEG);
			}
		}
		poliza.setCoberturaList(coberturaList);
		Integer cantRies = Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CPOL_CANTRIES));
		List<Riesgo> riesgoList = new ArrayList<Riesgo>();
		for (int i = 0; i < MessageConstants.MSG_RES_CPOL_RIESLIST; i++) {
			if (i < cantRies) {
				Riesgo riesgo = new Riesgo();
				riesgo.setDescripcion(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CPOL_RIESDESCRIPCION));
				riesgo.setContenido(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CPOL_RIESCONTENIDO));
				riesgoList.add(riesgo);
			} else {
				String riesgoFil = getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CPOL_RIESDESCRIPCION + MessageConstants.MSG_RES_CPOL_RIESCONTENIDO);
			}
		}
		poliza.setRiesgoList(riesgoList);

		return poliza;
	}

	// Get Producto List (Request)
	public static String reqMFGetProductoList(final Integer compania) {
		StringBuffer reqMF = new StringBuffer();
		String vTipo = "  ";
		reqMF.append(setHeader(MessageConstants.MSG_PPRD_MESSAGEID, vTipo));
		reqMF.append(setField(compania.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_PPRD_COMPANIA));
		return reqMF.toString();
	}

	// Get Producto List (Response)
	public static List<Producto> resMFGetProductoList(final String response) {
		List<Producto> productoList = new ArrayList<Producto>();
		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_PPRD_INI);
		Integer cantProd = Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_PPRD_CANTPROD));
		for (int i = 0; i < cantProd; i++) {
			Producto producto = new Producto();
			producto.setId(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_PPRD_PRODCODIGO));
			producto.setNameComp(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_PPRD_PRODDESCRICOMPLETA));
			producto.setName(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_PPRD_PRODDESCRIPCION));

			productoList.add(producto);
		}

		return productoList;
	}

	// Get Canal List (Request)
	public static String reqMFGetCanalList(final Integer compania) {
		StringBuffer reqMF = new StringBuffer();
		String vTipo = "  ";
		reqMF.append(setHeader(MessageConstants.MSG_PCAN_MESSAGEID, vTipo));
		reqMF.append(setField(compania.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_PCAN_COMPANIA));
		return reqMF.toString();
	}

	// Get Canal List (Response)
	public static List<Canal> resMFGetCanalList(final String response) {
		List<Canal> canalList = new ArrayList<Canal>();
		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_PCAN_INI);
		Integer cantCanal = Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_PCAN_CANTCANAL));
		for (int i = 0; i < cantCanal; i++) {
			Canal canal = new Canal();
			canal.setId(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_PCAN_CANALCODIGO));
			canal.setName(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_PCAN_CANALDESCRIPCION));

			canalList.add(canal);
		}

		return canalList;
	}

	// Get Sucursal List (Request)
	public static String reqMFGetSucursalList(final Integer compania) {
		StringBuffer reqMF = new StringBuffer();
		String vTipo = "  ";
		// se define que siempre viaje 20 en compania, se deja x si en un futuro
		// se decide explotar la tabla x cias.
		String vCia = "0020";
		reqMF.append(setHeader(MessageConstants.MSG_PSUC_MESSAGEID, vTipo));
		reqMF.append(vCia);
		return reqMF.toString();
	}

	// Get Sucursal List (Response)
	public static List<Sucursal> resMFGetSucursalList(final String response) {
		List<Sucursal> sucursalList = new ArrayList<Sucursal>();
		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_PSUC_INI);
		Integer cantSuc = Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_PSUC_CANTSUC));
		for (int i = 0; i < cantSuc; i++) {
			Sucursal sucursal = new Sucursal();
			sucursal.setId(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_PSUC_SUCCODIGO));
			sucursal.setName(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_PSUC_SUCDESCRIPCION));
			sucursalList.add(sucursal);
		}

		return sucursalList;
	}

	// Get Endoso (Request)
	public static String reqMFGetConEndoso(final Integer compania, final String poliza, final Integer fechaDesde,
			final Integer fechaHasta) {
		StringBuffer reqMF = new StringBuffer();
		String vTipo = "  ";
		reqMF.append(setHeader(MessageConstants.MSG_CEND_MessageID, vTipo));
		reqMF.append(setField(compania.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_CEND_COMPANIA));
		reqMF.append(setField(poliza, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_CEND_POLIZA));
		reqMF.append(setField(fechaDesde.toString(), MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_CEND_FECHADESDE));
		reqMF.append(setField(fechaHasta.toString(), MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_CEND_FECHAHASTA));
		return reqMF.toString();
	}

	// Get Endoso (Response)
	public static ConEndoso resMFGetConEndoso(final String response) {
		ConEndoso conEndoso = new ConEndoso();
		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_CEND_INI);
		Producto producto = new Producto();
		producto.setId(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CEND_producto));
		conEndoso.setProducto(producto);
		Sucursal sucursal = new Sucursal();
		sucursal.setId(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CEND_sucursal));
		conEndoso.setSucursal(sucursal);
		Canal canal = new Canal();
		canal.setId(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion, MessageConstants.MSG_RES_CEND_canal));
		conEndoso.setCanal(canal);
		conEndoso.setFechaEmision(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CEND_fechaEmision)));
		conEndoso.setEstado(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CEND_estado));
		conEndoso.setTomador(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CEND_tomador));
		conEndoso.setTipDoc(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CEND_tipDoc));
		conEndoso.setNroDoc(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CEND_nroDoc));
		conEndoso.setVendedorLegajo(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CEND_vendedorLegajo));
		conEndoso.setVendedorNombre(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CEND_vendedorNombre));
		Integer cantEnd = Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CEND_cantEnd));
		List<Endoso> endosoList = new ArrayList<Endoso>();
		for (int i = 0; i < cantEnd; i++) {
			Endoso endoso = new Endoso();
			endoso.setEndoso(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
					MessageConstants.MSG_RES_CEND_endEndoso)));
			endoso.setVigenciaDesde(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
					MessageConstants.MSG_RES_CEND_endVigenciaDesde)));
			endoso.setVigenciaHasta(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
					MessageConstants.MSG_RES_CEND_endVigenciaHasta)));
			endoso.setMotivo(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_CEND_endMotivo));
			endosoList.add(endoso);
		}
		conEndoso.setEndosoList(endosoList);

		return conEndoso;
	}

	// Get ConSiniestro List (Request)
	public static String reqMFGetConSiniestroList(final String tipoBusqueda, final Integer tipDoc, final String nroDoc,
			final String apellido, final String poliza, final String siniestro, final Long orden, final Integer compania,
			final String estado, final Integer fechaDesde, final Integer fechaHasta, final String paramStart) {
		StringBuffer reqMF = new StringBuffer();
		String vTipo = "  ";
		if (!paramStart.equals("")) {
			vTipo = "TR";
		}
		reqMF.append(setHeader(MessageConstants.MSG_CSIL_MessageID, vTipo));
		reqMF.append(setField(tipoBusqueda, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_CSIL_tipoBusqueda));
		reqMF.append(setField(tipDoc.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_CSIL_tipDoc));
		reqMF.append(setField(nroDoc, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_CSIL_nroDoc));
		reqMF.append(setField(apellido, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_CSIL_apellido));
		reqMF.append(setField(poliza, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_CSIL_poliza));
		reqMF.append(setField(siniestro, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_CSIL_siniestro));
		reqMF.append(setField(orden.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_CSIL_orden));
		reqMF.append(setField(compania.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_CCLL_COMPANIA));
		reqMF.append(setField(estado, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_CSIL_estado));
		reqMF.append(setField(fechaDesde.toString(), MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_CSIL_fechaDesde));
		reqMF.append(setField(fechaHasta.toString(), MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_CSIL_fechaHasta));
		reqMF.append(setField(paramStart, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_CSIL_paramStart));
		return reqMF.toString();
	}

	// Get ConSiniestro List (Response)
	public static List<ConSiniestro> resMFGetConSiniestroList(final String response) {
		List<ConSiniestro> conSiniestroList = null;

		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_CSIL_INI);
		conSiniestroList = new ArrayList<ConSiniestro>();
		Integer cantReg = Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CSIL_cantReg));
		for (int i = 0; i < cantReg; i++) {
			ConSiniestro conSiniestro = new ConSiniestro();
			Compania compania = new Compania();
			compania.setId(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
					MessageConstants.MSG_RES_CSIL_compania)));
			conSiniestro.setCompania(compania);
			conSiniestro.setPoliza(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_CSIL_poliza));
			conSiniestro.setTomador(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_CSIL_tomador));
			conSiniestro.setOrden(Long.parseLong(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
					MessageConstants.MSG_RES_CSIL_orden)));
			conSiniestro.setSiniestro(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_CSIL_siniestro));
			conSiniestro.setFechaSiniestro(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC,
					auxPosicion, MessageConstants.MSG_RES_CSIL_fechaSiniestro)));
			conSiniestro.setEstado(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_CSIL_estado));

			conSiniestroList.add(conSiniestro);
		}

		return conSiniestroList;
	}

	// Get Siniestro (Request)
	public static String reqMFGetConSiniestro(final Integer compania, final String siniestro) {
		StringBuffer reqMF = new StringBuffer();
		String vTipo = "  ";
		reqMF.append(setHeader(MessageConstants.MSG_CSIN_MessageID, vTipo));
		reqMF.append(setField(compania.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_CSIN_compania));
		reqMF.append(setField(siniestro, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_CSIN_siniestro));
		return reqMF.toString();
	}

	// Get Siniestro (Response)
	public static Siniestro resMFGetConSiniestro(final String response) {
		Siniestro siniestro = new Siniestro();
		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_CSIN_INI);
		siniestro.setPoliza(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CSIN_poliza));
		siniestro.setTomador(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CSIN_tomador));
		siniestro.setTipDoc(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CSIN_tipDoc));
		siniestro.setNroDoc(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CSIN_nroDoc));
		siniestro.setVigenciaDesde(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CSIN_vigenciaDesde)));
		siniestro.setVigenciaHasta(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CSIN_vigenciaHasta)));
		siniestro.setOrden(Long.parseLong(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CSIN_orden)));
		siniestro.setFechaRegistracion(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CSIN_fechaRegistracion)));
		siniestro.setFechaComunicacion(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CSIN_fechaComunicacion)));
		siniestro.setFechaSiniestro(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CSIN_fechaSiniestro)));
		siniestro.setLugar(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CSIN_lugar));
		siniestro.setCausa(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CSIN_causa));
		Integer cantCob = Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CSIN_cantCob));
		List<SinCobertura> sinCoberturaList = new ArrayList<SinCobertura>();
		for (int i = 0; i < MessageConstants.MSG_RES_CSIN_cobList; i++) {
			if (i < cantCob) {
				SinCobertura sinCobertura = new SinCobertura();
				sinCobertura.setDescripcion(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CSIN_cobDescripcion));
				sinCoberturaList.add(sinCobertura);
			} else {
				String sinCoberturaFil = getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CSIN_cobDescripcion);
			}
		}
		siniestro.setSinCoberturaList(sinCoberturaList);
		siniestro.setEstado(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_CSIN_estado));
		siniestro.setFechaEstado(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CSIN_fechaEstado)));
		Integer cantDet = Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CSIN_cantDet));
		List<SinDetalle> sinDetalleList = new ArrayList<SinDetalle>();
		for (int i = 0; i < MessageConstants.MSG_RES_CSIN_detList; i++) {
			if (i < cantDet) {
				SinDetalle sinDetalle = new SinDetalle();
				sinDetalle.setDescripcion(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CSIN_detDescripcion));
				sinDetalleList.add(sinDetalle);
			} else {
				String sinDetalleFil = getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CSIN_detDescripcion);
			}
		}
		siniestro.setSinDetalleList(sinDetalleList);
		Integer cantEstado = Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CSIN_cantEst));
		List<SinEstado> sinEstadoList = new ArrayList<SinEstado>();
		for (int i = 0; i < MessageConstants.MSG_RES_CSIN_estList; i++) {
			if (i < cantEstado) {
				SinEstado sinEstado = new SinEstado();
				sinEstado.setDescripcion(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CSIN_estEstado));
				sinEstado.setFechaEstado(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
						MessageConstants.MSG_RES_CSIN_fechaEstado)));
				sinEstadoList.add(sinEstado);
			} else {
				String estadoFil = getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CSIN_estEstado + MessageConstants.MSG_RES_CSIN_fechaEstado);
			}
		}
		siniestro.setSinEstadoList(sinEstadoList);
		Integer cantPago = Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_CSIN_cantPag));
		List<SinPago> sinPagoList = new ArrayList<SinPago>();
		for (int i = 0; i < MessageConstants.MSG_RES_CSIN_pagList; i++) {
			if (i < cantPago) {
				SinPago sinPago = new SinPago();
				sinPago.setDetalle(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CSIN_pagDetalle));
				sinPago.setBeneficiario(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CSIN_pagBeneficiario));
				sinPago.setImporte(Double.parseDouble(getField(response, MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
						MessageConstants.MSG_RES_CSIN_pagImporte, MessageConstants.MSG_RES_CSIN_pagImporte_DEC)));
				sinPago.setFechaPago(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
						MessageConstants.MSG_RES_CSIN_pagFechaPago)));
				sinPagoList.add(sinPago);
			} else {
				String pagoFil = getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_CSIN_pagDetalle + MessageConstants.MSG_RES_CSIN_pagBeneficiario
								+ MessageConstants.MSG_RES_CSIN_pagImporte + MessageConstants.MSG_RES_CSIN_pagFechaPago);
			}
		}
		siniestro.setSinPagoList(sinPagoList);

		return siniestro;
	}

	// Get DenDocReq List (Request)
	public static String reqMFGetDenDocReqList(final Integer compania, final String producto) {
		StringBuffer reqMF = new StringBuffer();
		String vTipo = "  ";
		reqMF.append(setHeader(MessageConstants.MSG_ODDR_MessageID, vTipo));
		reqMF.append(setField(compania.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_ODDR_compania));
		reqMF.append(setField(producto, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_ODDR_producto));
		return reqMF.toString();
	}

	// Get DenDocReq List (Response)
	public static List<DenDocReq> resMFGetDenDocReqList(final String response) {
		List<DenDocReq> denDocReqList = null;

		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_ODDR_INI);
		denDocReqList = new ArrayList<DenDocReq>();
		for (int i = 0; i < MessageConstants.MSG_RES_ODDR_oddList; i++) {
			String documentacion = getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_ODDR_documentacion);
			if (!documentacion.equalsIgnoreCase("")) {
				DenDocReq denDocReq = new DenDocReq();
				denDocReq.setDocumentacion(documentacion);

				denDocReqList.add(denDocReq);
			}
		}

		return denDocReqList;
	}

	// Get Denuncia de Siniestro (Request)
	public static String reqMFGetOpeSiniestro(final Long orden) {
		StringBuffer reqMF = new StringBuffer();
		String vTipo = "  ";
		reqMF.append(setHeader(MessageConstants.MSG_ODEC_MessageID, vTipo));
		reqMF.append(setField(orden.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_ODEC_orden));
		return reqMF.toString();
	}

	// Get Denuncia de Siniestro (Response)
	public static Denuncia resMFGetOpeSiniestro(final String response, final Long orden) {
		Denuncia denuncia = new Denuncia();
		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_ODEC_INI);
		denuncia.setOrden(orden);
		Compania compania = new Compania();
		compania.setId(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_ODEC_compania)));
		denuncia.setCompania(compania);
		Producto producto = new Producto();
		producto.setId(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_ODEC_producto));
		denuncia.setProducto(producto);
		denuncia.setPoliza(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_ODEC_poliza));
		denuncia.setEndoso(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_ODEC_endoso)));
		denuncia.setSiniestro(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_ODEC_siniestro));
		denuncia.setFechaSiniestro(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_ODEC_fechaSiniestro)));
		denuncia.setEsDenAseg(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_ODEC_esDenAseg).equalsIgnoreCase("N") ? false : true);
		denuncia.setDenTipDoc(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_ODEC_denTipDoc));
		denuncia.setDenNroDoc(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_ODEC_denNroDoc));
		denuncia.setDenApeNom(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_ODEC_denApeNom));
		Parentesco parentesco = new Parentesco();
		parentesco.setId(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_ODEC_denParentesco));
		denuncia.setDenParentesco(parentesco);
		denuncia.setTipDoc(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_ODEC_tipDoc));
		denuncia.setNroDoc(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_ODEC_nroDoc));
		denuncia.setTomador(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_ODEC_tomador));
		denuncia.setDescSiniestro(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_ODEC_descSiniestro));
		denuncia.setDatosSiniestro(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_ODEC_datosSiniestro));
		denuncia.setEstado(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_ODEC_estado));
		denuncia.setFechaDenuncia(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_ODEC_fechaDenuncia)));
		denuncia.setPeopleSoft(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_ODEC_peopleSoft));
		denuncia.setUsuApeNom(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_ODEC_usuApeNom));
		return denuncia;
	}

	// Set Denuncia de Siniestro (Request)
	public static String reqMFSetOpeSiniestro(final Denuncia denuncia) {
		StringBuffer reqMF = new StringBuffer();
		String vTipo = "  ";
		reqMF.append(setHeader(MessageConstants.MSG_ODEN_MessageID, vTipo));
		reqMF.append(setField(denuncia.getCompania().getId().toString(), MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_ODEN_compania));
		reqMF.append(setField(denuncia.getProducto().getId(), MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_ODEN_producto));
		reqMF.append(setField(denuncia.getPoliza(), MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_ODEN_poliza));
		reqMF.append(setField(denuncia.getEndoso().toString(), MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_ODEN_endoso));
		reqMF.append(setField(denuncia.getFechaSiniestro().toString(), MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_ODEN_fechaSiniestro));
		reqMF.append(setField(denuncia.getEsDenAseg() ? "S" : "N", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_ODEN_esDenAseg));
		reqMF.append(setField(denuncia.getDenTipDoc(), MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_ODEN_denTipDoc));
		reqMF.append(setField(denuncia.getDenNroDoc(), MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_ODEN_denNroDoc));
		reqMF.append(setField(denuncia.getDenApeNom(), MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_ODEN_denApeNom));
		reqMF.append(setField(denuncia.getDenParentesco().getId(), MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_ODEN_denParentesco));
		reqMF.append(setField(denuncia.getTipDoc(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_ODEN_tipDoc));
		reqMF.append(setField(denuncia.getNroDoc(), MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_ODEN_nroDoc));
		reqMF.append(setField(denuncia.getTomador(), MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_ODEN_tomador));
		reqMF.append(setField(denuncia.getDescSiniestro(), MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_ODEN_descSiniestro));
		reqMF.append(setField(denuncia.getDatosSiniestro(), MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_ODEN_datosSiniestro));
		reqMF.append(setField(denuncia.getFechaDenuncia().toString(), MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_ODEN_fechaDenuncia));
		reqMF.append(setField(denuncia.getPeopleSoft(), MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_ODEN_peopleSoft));
		reqMF.append(setField(denuncia.getUsuApeNom(), MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_ODEN_usuApeNom));
		return reqMF.toString();
	}

	// Set Denuncia de Siniestro (Response)
	public static Long resMFSetOpeSiniestro(final String response) {
		Long orden = null;
		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_ODEN_INI);
		orden = Long.parseLong(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_ODEN_orden));
		return orden;
	}

	// Set Estado Denuncia de Siniestro (Request)
	public static String reqMFSetOpeSiniestroEst(final Long orden, final String estado) {
		StringBuffer reqMF = new StringBuffer();
		String vTipo = "  ";
		reqMF.append(setHeader(MessageConstants.MSG_ODES_MessageID, vTipo));
		reqMF.append(setField(orden.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_ODES_orden));
		reqMF.append(setField(estado, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_ODES_estado));
		return reqMF.toString();
	}

	// Set Estado Denuncia de Siniestro (Response)
	public static Boolean resMFSetOpeSiniestroEst(final String response) {
		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_ODES_INI);
		return true;
	}

	// Get OpeSiniestro List (Request)
	public static String reqMFGetOpeSiniestroList(final String tipoBusqueda, final Integer tipDoc, final String nroDoc,
			final String apellido, final String poliza, final Long orden, final Integer compania, final String estado,
			final Integer fechaDesde, final Integer fechaHasta, final String paramStart) {
		StringBuffer reqMF = new StringBuffer();
		String vTipo = "  ";
		if (!paramStart.equals("")) {
			vTipo = "TR";
		}
		reqMF.append(setHeader(MessageConstants.MSG_ODEL_MessageID, vTipo));
		reqMF.append(setField(tipoBusqueda, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_ODEL_tipoBusqueda));
		reqMF.append(setField(tipDoc.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_ODEL_tipDoc));
		reqMF.append(setField(nroDoc, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_ODEL_nroDoc));
		reqMF.append(setField(apellido, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_ODEL_apellido));
		reqMF.append(setField(poliza, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_ODEL_poliza));
		reqMF.append(setField(orden.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_ODEL_orden));
		reqMF.append(setField(compania.toString(), MessageConstants.MSG_TYPE_NUMERIC, MessageConstants.MSG_REQ_CCLL_COMPANIA));
		reqMF.append(setField(estado, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_ODEL_estado));
		reqMF.append(setField(fechaDesde.toString(), MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_ODEL_fechaDesde));
		reqMF.append(setField(fechaHasta.toString(), MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_ODEL_fechaHasta));
		reqMF.append(setField(paramStart, MessageConstants.MSG_TYPE_STRING, MessageConstants.MSG_REQ_ODEL_paramStart));
		return reqMF.toString();
	}

	// Get OpeSiniestro List (Response)
	public static List<Denuncia> resMFGetOpeSiniestroList(final String response) {
		List<Denuncia> denunciaList = null;

		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_ODEL_INI);
		denunciaList = new ArrayList<Denuncia>();
		Integer cantReg = Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_ODEL_cantReg));
		for (int i = 0; i < cantReg; i++) {
			Denuncia denuncia = new Denuncia();
			Compania compania = new Compania();
			compania.setId(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
					MessageConstants.MSG_RES_ODEL_compania)));
			denuncia.setCompania(compania);
			denuncia.setPoliza(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_ODEL_poliza));
			denuncia.setTomador(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_ODEL_tomador));
			denuncia.setOrden(Long.parseLong(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
					MessageConstants.MSG_RES_ODEL_orden)));
			denuncia.setFechaSiniestro(Integer.parseInt(getField(response, MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
					MessageConstants.MSG_RES_ODEL_fechaDenuncia)));
			denuncia.setEstado(getField(response, MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_ODEL_estado));

			denunciaList.add(denuncia);
		}

		return denunciaList;
	}
}

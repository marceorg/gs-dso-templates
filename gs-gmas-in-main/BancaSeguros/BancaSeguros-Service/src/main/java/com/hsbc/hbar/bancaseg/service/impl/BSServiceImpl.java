/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.service.impl;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;

import com.hsbc.hbar.bancaseg.model.bs.Cliente;
import com.hsbc.hbar.bancaseg.model.bs.ConClienteInf;
import com.hsbc.hbar.bancaseg.model.bs.ConEndoso;
import com.hsbc.hbar.bancaseg.model.bs.ConSiniestroInf;
import com.hsbc.hbar.bancaseg.model.bs.Denuncia;
import com.hsbc.hbar.bancaseg.model.bs.OpeEmitidaInf;
import com.hsbc.hbar.bancaseg.model.bs.OpeSiniestroInf;
import com.hsbc.hbar.bancaseg.model.bs.Poliza;
import com.hsbc.hbar.bancaseg.model.bs.Reclamo;
import com.hsbc.hbar.bancaseg.model.bs.ResMensajeGen;
import com.hsbc.hbar.bancaseg.model.bs.Siniestro;
import com.hsbc.hbar.bancaseg.model.common.Compania;
import com.hsbc.hbar.bancaseg.model.common.FileParam;
import com.hsbc.hbar.bancaseg.model.common.Parentesco;
import com.hsbc.hbar.bancaseg.model.common.Producto;
import com.hsbc.hbar.bancaseg.model.enums.DestinationEnum;
import com.hsbc.hbar.bancaseg.model.enums.MdwEnum;
import com.hsbc.hbar.bancaseg.service.BSService;
import com.hsbc.hbar.bancaseg.service.JMSCommService;
import com.hsbc.hbar.bancaseg.service.MdwService;
import com.hsbc.hbar.bancaseg.service.UtilCommService;
import com.hsbc.hbar.bancaseg.service.utils.UtilFormat;
import com.hsbc.hbar.bancaseg.service.utils.XMLConvert;

public class BSServiceImpl implements BSService {
	static Logger logger = LogManager.getLogger(BSServiceImpl.class);
	private static final String C_CIAASCOD = "CIAASCOD";

	private JMSCommService jmsCommService;
	private UtilCommService utilCommService;
	private MdwService mdwService;

	public MdwService getMdwService() {
		if (this.mdwService == null) {
			this.mdwService = (MdwService) ServiceFactory.getContext().getBean("MdwService");
		}
		return this.mdwService;
	}

	public void setMdwService(final MdwService mdwService) {
		this.mdwService = mdwService;
	}

	public JMSCommService getJMSCommService() {
		if (this.jmsCommService == null) {
			this.jmsCommService = (JMSCommService) ServiceFactory.getContext().getBean("JMSCommService");
		}
		return this.jmsCommService;
	}

	public void setJMSCommService(final JMSCommService jmsCommService) {
		this.jmsCommService = jmsCommService;
	}

	public UtilCommService getUtilCommService() {
		if (this.utilCommService == null) {
			this.utilCommService = (UtilCommService) ServiceFactory.getContext().getBean("UtilCommService");
		}
		return this.utilCommService;
	}

	public void setUtilCommService(final UtilCommService utilCommService) {
		this.utilCommService = utilCommService;
	}

	public OpeEmitidaInf getOpeEmitidaList(final Integer cache, final Integer fechaDesde, final Integer fechaHasta,
			final Integer compania, final String producto, final String paramStart) {
		return this.getJMSCommService().getOpeEmitidaList(fechaDesde, fechaHasta, compania, producto, paramStart);
	}

	public ConClienteInf getConClienteList(final Integer cache, final String tipoBusqueda, final Integer tipDoc,
			final String nroDoc, final String apellido, final Integer compania, final String poliza, final String paramStart) {
		return this.getJMSCommService().getConClienteList(tipoBusqueda, tipDoc, nroDoc, apellido, compania, poliza,
				paramStart);
	}

	public Cliente getConCliente(final Integer cache, final Integer compania, final String poliza) {
		return this.getJMSCommService().getConCliente(compania, poliza);
	}

	public Poliza getConPoliza(final Integer cache, final Integer compania, final String poliza, final Integer endoso) {
		return this.getJMSCommService().getConPoliza(compania, poliza, endoso);
	}

	public ConEndoso getConEndoso(final Integer cache, final Integer compania, final String poliza,
			final Integer fechaDesde, final Integer fechaHasta) {
		return this.getJMSCommService().getConEndoso(compania, poliza, fechaDesde, fechaHasta);
	}

	public ConSiniestroInf getConSiniestroList(final Integer cache, final String tipoBusqueda, final Integer tipDoc,
			final String nroDoc, final String apellido, final String poliza, final String siniestro, final Long orden,
			final Integer compania, final String estado, final Integer fechaDesde, final Integer fechaHasta,
			final String paramStart) {
		return this.getJMSCommService().getConSiniestroList(tipoBusqueda, tipDoc, nroDoc, apellido, poliza, siniestro,
				orden, compania, estado, fechaDesde, fechaHasta, paramStart);
	}

	public Siniestro getConSiniestro(final Integer cache, final Integer compania, final String siniestro) {
		return this.getJMSCommService().getConSiniestro(compania, siniestro);
	}

	public Denuncia getOpeSiniestro(final Integer cache, final Long orden) {
		Denuncia denuncia = this.getJMSCommService().getOpeSiniestro(orden);
		try {
			List<String> items = this.getUtilCommService().retrieveReportList(orden);
			if (items != null) {
				for (int x = 0; x < items.size(); x++) {
					if (x == 0) {
						denuncia.setAdjunto1(true);
					}
					if (x == 1) {
						denuncia.setAdjunto2(true);
					}
					if (x == 2) {
						denuncia.setAdjunto3(true);
					}
				}
			}
		} catch (Exception e) {
			BSServiceImpl.logger.error(e);
		}
		return denuncia;

	}

	public Long setOpeSiniestro(final Integer cache, final Integer companiaId, final String productoId, final String poliza,
			final Integer endoso, final String tomador, final String tipDoc, final String nroDoc,
			final Integer fechaDenuncia, final Integer fechaSiniestro, final Boolean esDenAseg, final String denTipDoc,
			final String denNroDoc, final String denApeNom, final String denParentescoId, final String descSiniestro,
			final String datosSiniestro, final String peopleSoft, final String usuApeNom) {
		// Llenar el objeto Denuncia
		Denuncia denuncia = new Denuncia();
		Compania compania = new Compania();
		compania.setId(companiaId);
		denuncia.setCompania(compania);
		Producto producto = new Producto();
		producto.setId(productoId);
		denuncia.setProducto(producto);
		denuncia.setPoliza(poliza);
		denuncia.setEndoso(endoso);
		denuncia.setTomador(UtilFormat.getValChars(tomador));
		denuncia.setTipDoc(tipDoc);
		denuncia.setNroDoc(nroDoc);
		denuncia.setFechaDenuncia(fechaDenuncia);
		denuncia.setFechaSiniestro(fechaSiniestro);
		denuncia.setEsDenAseg(esDenAseg);
		denuncia.setDenTipDoc(denTipDoc);
		denuncia.setDenNroDoc(denNroDoc);
		denuncia.setDenApeNom(UtilFormat.getValChars(denApeNom));
		Parentesco parentesco = new Parentesco();
		parentesco.setId(denParentescoId);
		denuncia.setDenParentesco(parentesco);
		denuncia.setDescSiniestro(UtilFormat.getValChars(descSiniestro));
		denuncia.setDatosSiniestro(UtilFormat.getValChars(datosSiniestro));
		denuncia.setPeopleSoft(peopleSoft);
		denuncia.setUsuApeNom(usuApeNom);

		return this.getJMSCommService().setOpeSiniestro(denuncia);
	}

	public Boolean setOpeSiniestroEst(final Integer cache, final Long orden, final String estado) {
		return this.getJMSCommService().setOpeSiniestroEst(orden, estado);
	}

	public Boolean setOpeSiniestroSendMail(final Integer cache, final Long orden, final String recipientTO,
			final Integer cantAdj) {
		Boolean ret = true;
		Integer maxLlamados = 5;
		Integer canLlamados = 0;

		try {
			// Obtener Lista de Archivos Coldview
			List<String> items = null;
			while (canLlamados < maxLlamados && (items == null || items.size() < cantAdj)) {
				items = this.getUtilCommService().retrieveReportList(orden);
				canLlamados++;
			}
			// Armar array de adjuntos
			int fSize = 1;
			if (items != null) {
				fSize = items.size() + 1;
			}

			FileParam[] files = new FileParam[fSize];

			// Obtener impreso de la denuncia
			Denuncia denuncia = new Denuncia();
			denuncia = this.getJMSCommService().getOpeSiniestro(orden);
			// Formatear XML, agregar campos requeridos
			String xml = XMLConvert.getDenunciaXML4PDF(denuncia);
			String b64PDF = this.getUtilCommService().generatePDFReport(xml, "BS_Denuncia");
			FileParam filePar = new FileParam(b64PDF, "Denuncia.pdf");
			files[0] = filePar;

			// Obtener Archivos Coldview
			if (items != null) {
				for (int x = 0; x < items.size(); x++) {
					String content = this.getUtilCommService().retrieveReport(orden, items.get(x));
					FileParam fileParam = new FileParam(content, "Adjunto" + items.get(x) + ".pdf");
					files[x + 1] = fileParam;
				}
			}
			// Enviar EMail
			String parametersTemplate = "ORDEN=" + orden.toString() + ",CIA=" + denuncia.getCompania().getName()
					+ ",FECHADEN=" + UtilFormat.setNumberToDate(denuncia.getFechaDenuncia()) + ",POLIZA="
					+ denuncia.getPoliza() + ",APEYNOM=" + denuncia.getTomador().replace(",", " ") + ",DOCUM="
					+ denuncia.getTipDoc() + " " + denuncia.getNroDoc();
			if (!this.getUtilCommService().sendPdfReport(files, recipientTO, "", "", "NYLVO_SINIESTRO_ENV",
					parametersTemplate, "", "", "", "")) {
				ret = false;
			}
		} catch (Exception e) {
			BSServiceImpl.logger.error(e);
			ret = false;
		}

		return ret;
	}

	public OpeSiniestroInf getOpeSiniestroList(final Integer cache, final String tipoBusqueda, final Integer tipDoc,
			final String nroDoc, final String apellido, final String poliza, final Long orden, final Integer compania,
			final String estado, final Integer fechaDesde, final Integer fechaHasta, final String paramStart) {
		return this.getJMSCommService().getOpeSiniestroList(tipoBusqueda, tipDoc, nroDoc, apellido, poliza, orden, compania,
				estado, fechaDesde, fechaHasta, paramStart);
	}

	public ResMensajeGen getConCobranza(final Integer cache, final Integer compania, final String poliza,
			final Integer fechaDesde, final Integer fechaHasta, final String paramStart) {
		ResMensajeGen resMensajeGen = null;
		try {
			// producto variable
			JSONObject requestSvc = new JSONObject();
			requestSvc.put(BSServiceImpl.C_CIAASCOD, compania);
			requestSvc.put("POLIZA", poliza);
			requestSvc.put("FECHADDE", fechaDesde);
			requestSvc.put("FECHAHTA", fechaHasta);
			requestSvc.put("PARM-START", paramStart);
			String respSvc = this.getMdwService().getInsSvcGen(DestinationEnum.MQ, MdwEnum.MQ_1011_BS_SITUACION_COBRANZAS,
					requestSvc.toString());
			JSONObject responseSvc = new JSONObject(respSvc);
			if (responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
				String est = responseSvc.getJSONObject("Message").getJSONObject("Request").getString("ESTADO");
				String pSt = responseSvc.getJSONObject("Message").getJSONObject("Request").getString("PARM-START");
				String jRs = responseSvc.getJSONObject("Message").getJSONObject("DATOS").toString();
				resMensajeGen = new ResMensajeGen(est, pSt, jRs);
			}
		} catch (Exception e) {
			BSServiceImpl.logger.error(e);
		}

		return resMensajeGen;
	}

	public ResMensajeGen getTipoReclamo(final Integer cache, final Integer compania, final String ramo) {
		ResMensajeGen resMensajeGen = null;
		try {
			JSONObject requestSvc = new JSONObject();
			requestSvc.put(BSServiceImpl.C_CIAASCOD, compania);
			requestSvc.put("RAMO", ramo);
			String respSvc = this.getMdwService().getInsSvcGen(DestinationEnum.MQ, MdwEnum.MQ_1201_BS_TIPO_RECLAMO,
					requestSvc.toString());
			JSONObject responseSvc = new JSONObject(respSvc);
			if (responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
				String est = responseSvc.getJSONObject("Message").getJSONObject("Request").getString("ESTADO");
				String pSt = "";
				String jRs = responseSvc.getJSONObject("Message").getJSONObject("DATOS").toString();
				resMensajeGen = new ResMensajeGen(est, pSt, jRs);
			}
		} catch (Exception e) {
			BSServiceImpl.logger.error(e);
		}

		return resMensajeGen;
	}

	public ResMensajeGen getMotReclamo(final Integer cache, final Integer compania, final String ramo, final Integer tiporec) {
		ResMensajeGen resMensajeGen = null;
		try {
			JSONObject requestSvc = new JSONObject();
			requestSvc.put(BSServiceImpl.C_CIAASCOD, compania);
			requestSvc.put("RAMO", ramo);
			requestSvc.put("TIPOREC", tiporec);

			String respSvc = this.getMdwService().getInsSvcGen(DestinationEnum.MQ, MdwEnum.MQ_1202_BS_MOT_RECLAMO,
					requestSvc.toString());
			JSONObject responseSvc = new JSONObject(respSvc);
			if (responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
				String est = responseSvc.getJSONObject("Message").getJSONObject("Request").getString("ESTADO");
				String pSt = "";
				String jRs = responseSvc.getJSONObject("Message").getJSONObject("DATOS").toString();
				resMensajeGen = new ResMensajeGen(est, pSt, jRs);
			}
		} catch (Exception e) {
			BSServiceImpl.logger.error(e);
		}

		return resMensajeGen;
	}

	public ResMensajeGen setOpeReclamo(final Integer cache, final Integer companiaId, final String productoId,
			final String poliza, final Integer endoso, final String tomador, final Integer tipDoc, final String nroDoc,
			final Integer fechaPedido, final Integer tipReg, final Integer tipMot, final String descPedido,
			final String telefono, final String email, final Integer peopleSoft, final String usuApeNom) {

		ResMensajeGen resMensajeGen = null;
		try {
			JSONObject requestSvc = new JSONObject();
			requestSvc.put(BSServiceImpl.C_CIAASCOD, companiaId);
			requestSvc.put("RAMO", productoId);
			requestSvc.put("POLIZA", poliza);

			requestSvc.put("ENDOSO", endoso);
			requestSvc.put("TIPODOC", tipDoc);
			requestSvc.put("NRODOC", nroDoc);
			requestSvc.put("APEYNOM", UtilFormat.getValChars(tomador));
			requestSvc.put("TIPOREC", tipReg);
			requestSvc.put("MOTREC", tipMot);
			requestSvc.put("DESCREC", UtilFormat.getValChars(descPedido));
			requestSvc.put("TELEFONO", UtilFormat.getValChars(telefono));
			requestSvc.put("EMAIL", UtilFormat.getValChars(email));
			requestSvc.put("FECHA", fechaPedido);
			requestSvc.put("PEOPLESOFT", peopleSoft);
			requestSvc.put("USUARNOM", usuApeNom);

			String respSvc = this.getMdwService().getInsSvcGen(DestinationEnum.MQ, MdwEnum.MQ_1203_BS_ALTA_RECLAMO,
					requestSvc.toString());
			JSONObject responseSvc = new JSONObject(respSvc);
			if (responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
				String est = responseSvc.getJSONObject("Message").getJSONObject("Request").getString("ESTADO");
				String pSt = "";
				String jRs = responseSvc.getJSONObject("Message").getJSONObject("DATOS").toString();
				resMensajeGen = new ResMensajeGen(est, pSt, jRs);
			}
		} catch (Exception e) {
			BSServiceImpl.logger.error(e);
		}

		return resMensajeGen;
	}

	public ResMensajeGen setOpeReclamoEst(final Integer cache, final Long orden, final String estado) {

		ResMensajeGen resMensajeGen = null;
		try {
			JSONObject requestSvc = new JSONObject();
			requestSvc.put("NROORDEN", orden);
			requestSvc.put("NVOESTADO", estado);

			String respSvc = this.getMdwService().getInsSvcGen(DestinationEnum.MQ, MdwEnum.MQ_1204_BS_ESTADO_RECLAMO,
					requestSvc.toString());
			JSONObject responseSvc = new JSONObject(respSvc);
			if (responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
				String est = responseSvc.getJSONObject("Message").getJSONObject("Request").getString("ESTADO");
				String pSt = "";
				String jRs = responseSvc.getJSONObject("Message").getJSONObject("DATOS").toString();
				resMensajeGen = new ResMensajeGen(est, pSt, jRs);
			}
		} catch (Exception e) {
			BSServiceImpl.logger.error(e);
		}

		return resMensajeGen;
	}

	public ResMensajeGen getOpeReclamoList(final Integer cache, final String tipoBusqueda, final Integer tipDoc,
			final String nroDoc, final String apellido, final String poliza, final Long orden, final Integer compania,
			final String estado, final Integer fechaDesde, final Integer fechaHasta, final String paramStart) {

		ResMensajeGen resMensajeGen = null;
		try {
			JSONObject requestSvc = new JSONObject();
			requestSvc.put("TIPOBUSQ", tipoBusqueda);
			requestSvc.put("DOCUMTIP", tipDoc);
			requestSvc.put("DOCUMDAT", nroDoc);
			requestSvc.put("APEYNOM", UtilFormat.getValChars(apellido));
			requestSvc.put("POLIZA", poliza);
			requestSvc.put("ORDEN", orden);
			requestSvc.put(BSServiceImpl.C_CIAASCOD, compania);
			requestSvc.put("RECESTADO", estado);
			requestSvc.put("FECHADES", fechaDesde);
			requestSvc.put("FECHAHAS", fechaHasta);
			requestSvc.put("PARM-START", paramStart);

			String respSvc = this.getMdwService().getInsSvcGen(DestinationEnum.MQ, MdwEnum.MQ_1205_BS_RECLAMO_LIST,
					requestSvc.toString());
			JSONObject responseSvc = new JSONObject(respSvc);
			if (responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
				String est = responseSvc.getJSONObject("Message").getJSONObject("Request").getString("ESTADO");
				String pSt = "";
				String jRs = responseSvc.getJSONObject("Message").getJSONObject("DATOS").toString();
				resMensajeGen = new ResMensajeGen(est, pSt, jRs);
			}
		} catch (Exception e) {
			BSServiceImpl.logger.error(e);
		}

		return resMensajeGen;
	}

	public ResMensajeGen getOpeReclamo(final Integer cache, final Long orden) {

		ResMensajeGen resMensajeGen = null;
		try {
			JSONObject requestSvc = new JSONObject();
			requestSvc.put("NROORDEN", orden);
			String respSvc = this.getMdwService().getInsSvcGen(DestinationEnum.MQ, MdwEnum.MQ_1206_BS_CONS_RECLAMO,
					requestSvc.toString());
			JSONObject responseSvc = new JSONObject(respSvc);
			if (responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
				String est = responseSvc.getJSONObject("Message").getJSONObject("Request").getString("ESTADO");
				String pSt = "";
				String jRs = responseSvc.getJSONObject("Message").getJSONObject("DATOS").toString();
				resMensajeGen = new ResMensajeGen(est, pSt, jRs);
			}
		} catch (Exception e) {
			BSServiceImpl.logger.error(e);
		}

		return resMensajeGen;
	}

	public String getReclamoAdj(final Integer cache, final Long orden) {
		String ret = "000";
		// para utilizar el repositorio de coldview de denuncia, se suma 10000
		// al
		// nro. de orden para que no de duplicado
		Long nroOrden = orden + 10000;

		try {
			List<String> items = this.getUtilCommService().retrieveReportList(nroOrden);
			if (items != null) {
				for (int x = 0; x < items.size(); x++) {
					if (x == 0) {
						ret = "100";
					}
					if (x == 1) {
						ret = "110";
					}
					if (x == 2) {
						ret = "111";
					}
				}
			}
		} catch (Exception e) {
			BSServiceImpl.logger.error(e);
		}
		return ret;
	}

	public Boolean setOpeReclamoSendMail(final Integer cache, final Long orden, final String recipientTO,
			final Integer cantAdj, final String compania, final String producto, final String poliza, final Integer endoso,
			final String tomador, final String tipDoc, final String nroDoc, final Integer fechaPedido, final String tipReg,
			final String motRec, final String descRec, final String telefono, final String email, final String peopleSoft) {
		Boolean ret = true;
		Integer maxLlamados = 5;
		Integer canLlamados = 0;

		// para utilizar el repositorio de coldview de denuncia, se suma 10000
		// al
		// nro. de orden para que no de duplicado
		Long nroOrden = orden + 10000;
		try {
			// Obtener Lista de Archivos Coldview
			List<String> items = null;
			while (canLlamados < maxLlamados && (items == null || items.size() < cantAdj)) {
				items = this.getUtilCommService().retrieveReportList(nroOrden);
				canLlamados++;
			}
			// Armar array de adjuntos
			int fSize = 1;
			if (items != null) {
				fSize = items.size() + 1;
			}

			FileParam[] files = new FileParam[fSize];

			// Obtener impreso del pedido
			Reclamo reclamo = new Reclamo();
			reclamo.setOrden(orden);
			reclamo.setCompania(compania);
			reclamo.setProducto(producto);
			reclamo.setPoliza(poliza);
			reclamo.setEndoso(endoso);
			reclamo.setTomador(UtilFormat.getValChars(tomador));
			reclamo.setTipDoc(tipDoc);
			reclamo.setNroDoc(nroDoc);
			reclamo.setFechaPedido(fechaPedido);
			reclamo.setTipReg(tipReg);
			reclamo.setMotRec(motRec);
			reclamo.setDescRec(UtilFormat.getValChars(descRec));
			reclamo.setTelefono(UtilFormat.getValChars(telefono));
			reclamo.setEmail(UtilFormat.getValChars(email));
			reclamo.setPeopleSoft(peopleSoft);

			String xml = XMLConvert.getReclamoXML4PDF(reclamo);
			String b64PDF = this.getUtilCommService().generatePDFReport(xml, "BS_Pedido");
			FileParam filePar = new FileParam(b64PDF, "Pedido.pdf");
			files[0] = filePar;

			// Obtener Archivos Coldview
			if (items != null) {
				for (int x = 0; x < items.size(); x++) {
					String content = this.getUtilCommService().retrieveReport(nroOrden, items.get(x));
					FileParam fileParam = new FileParam(content, "Adjunto" + items.get(x) + ".pdf");
					files[x + 1] = fileParam;
				}
			}
			// Enviar EMail
			String parametersTemplate = "ORDEN=" + orden.toString() + ",CIA=" + reclamo.getCompania() + ",FECHADEN="
					+ UtilFormat.setNumberToDate(reclamo.getFechaPedido()) + ",POLIZA=" + reclamo.getPoliza() + ",APEYNOM="
					+ reclamo.getTomador().replace(",", " ") + ",DOCUM=" + reclamo.getTipDoc() + " " + reclamo.getNroDoc();
			if (!this.getUtilCommService().sendPdfReport(files, recipientTO, "", "", "NYLVO_PEDIDO_ENV", parametersTemplate,
					"", "", "", "")) {
				ret = false;
			}
		} catch (Exception e) {
			BSServiceImpl.logger.error(e);
			ret = false;
		}

		return ret;
	}

}

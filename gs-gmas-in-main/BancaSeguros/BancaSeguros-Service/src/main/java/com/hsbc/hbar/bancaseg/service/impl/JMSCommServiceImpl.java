/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2014. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.jms.JMSException;
import javax.jms.Queue;
import javax.jms.TextMessage;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.jms.core.JmsTemplate;

import com.hsbc.hbar.bancaseg.dao.ParametersDao;
import com.hsbc.hbar.bancaseg.model.bs.Cliente;
import com.hsbc.hbar.bancaseg.model.bs.ConCliente;
import com.hsbc.hbar.bancaseg.model.bs.ConClienteInf;
import com.hsbc.hbar.bancaseg.model.bs.ConEndoso;
import com.hsbc.hbar.bancaseg.model.bs.ConSiniestro;
import com.hsbc.hbar.bancaseg.model.bs.ConSiniestroInf;
import com.hsbc.hbar.bancaseg.model.bs.Denuncia;
import com.hsbc.hbar.bancaseg.model.bs.OpeEmitida;
import com.hsbc.hbar.bancaseg.model.bs.OpeEmitidaInf;
import com.hsbc.hbar.bancaseg.model.bs.OpeSiniestroInf;
import com.hsbc.hbar.bancaseg.model.bs.Poliza;
import com.hsbc.hbar.bancaseg.model.bs.Siniestro;
import com.hsbc.hbar.bancaseg.model.common.Canal;
import com.hsbc.hbar.bancaseg.model.common.Compania;
import com.hsbc.hbar.bancaseg.model.common.DenDocReq;
import com.hsbc.hbar.bancaseg.model.common.Parentesco;
import com.hsbc.hbar.bancaseg.model.common.Producto;
import com.hsbc.hbar.bancaseg.model.common.Sucursal;
import com.hsbc.hbar.bancaseg.model.constant.MessageConstants;
import com.hsbc.hbar.bancaseg.service.JMSCommService;
import com.hsbc.hbar.bancaseg.service.utils.MsgCreator;
import com.hsbc.hbar.bancaseg.service.utils.MsgFormatter;

public class JMSCommServiceImpl implements JMSCommService {
	static Logger logger = LogManager.getLogger(JMSCommServiceImpl.class);

	private static final String C_AIN = "AreaIN: {}";
	private static final String C_AOUT = "AreaOUT: {}";

	private JmsTemplate jmsTemplate;
	private Queue requestQueue;
	private Queue responseQueue;
	private ParametersDao parametersDao;

	public JmsTemplate getJmsTemplate() {
		return this.jmsTemplate;
	}

	public void setJmsTemplate(final JmsTemplate jmsTemplate) {
		this.jmsTemplate = jmsTemplate;
	}

	public Queue getRequestQueue() {
		return this.requestQueue;
	}

	public void setRequestQueue(final Queue queue) {
		this.requestQueue = queue;
	}

	public Queue getResponseQueue() {
		return this.responseQueue;
	}

	public void setResponseQueue(final Queue responseQueue) {
		this.responseQueue = responseQueue;
	}

	public ParametersDao getParametersDao() {
		if (this.parametersDao == null) {
			this.parametersDao = (ParametersDao) ServiceFactory.getContext().getBean("ParametersDao");
		}
		return this.parametersDao;
	}

	public void setParametersDao(final ParametersDao parametersDao) {
		this.parametersDao = parametersDao;
	}

	public Object sendAndReceive(final String request) {
		// Armar Mensaje MQ
		MsgCreator msgCreator = new MsgCreator();
		msgCreator.setRequest(request);
		this.jmsTemplate.send(this.requestQueue, msgCreator);
		String jmsMessageID = "";
		try {
			jmsMessageID = msgCreator.getMessage().getJMSMessageID();
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
			return null;
		}
		// Timeout 60seg
		this.jmsTemplate.setReceiveTimeout(60000);
		// Respuesta MQ
		return this.jmsTemplate.receiveSelected(this.responseQueue, "JMSMessageID='" + jmsMessageID + "'");
	}

	public List<Producto> getProductoList(final Integer compania) {
		JMSCommServiceImpl.logger.info("Ejecutando getProductoList...");

		List<Producto> productoList = new ArrayList<Producto>();
		String request = MsgFormatter.reqMFGetProductoList(compania);

		JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AIN, request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AOUT, response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				productoList = MsgFormatter.resMFGetProductoList(response);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return productoList;
	}

	public List<Sucursal> getSucursalList(final Integer compania) {
		JMSCommServiceImpl.logger.info("Ejecutando getSucursalList...");

		List<Sucursal> sucursalList = new ArrayList<Sucursal>();
		String request = MsgFormatter.reqMFGetSucursalList(compania);

		JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AIN, request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AOUT, response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				sucursalList = MsgFormatter.resMFGetSucursalList(response);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return sucursalList;

	}

	public List<Canal> getCanalList(final Integer compania) {
		JMSCommServiceImpl.logger.info("Ejecutando getCanalList...");

		List<Canal> canalList = new ArrayList<Canal>();
		String request = MsgFormatter.reqMFGetCanalList(compania);

		JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AIN, request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AOUT, response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				canalList = MsgFormatter.resMFGetCanalList(response);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return canalList;

	}

	public List<DenDocReq> getDenDocReqList(final Integer compania, final String producto) {
		JMSCommServiceImpl.logger.info("Ejecutando getDenDocReqList...");

		List<DenDocReq> denDocReqList = new ArrayList<DenDocReq>();
		String request = MsgFormatter.reqMFGetDenDocReqList(compania, producto);

		JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AIN, request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AOUT, response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				denDocReqList = MsgFormatter.resMFGetDenDocReqList(response);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return denDocReqList;

	}

	public OpeEmitidaInf getOpeEmitidaList(final Integer fechaDesde, final Integer fechaHasta, final Integer compania,
			final String producto, final String paramStart) {
		JMSCommServiceImpl.logger.info("Ejecutando getOpeEmitidaList...");

		OpeEmitidaInf opeEmitidaInf = new OpeEmitidaInf();
		List<OpeEmitida> opeEmitidaList = null;
		String request = MsgFormatter.reqMFGetOpeEmitidaList(fechaDesde, fechaHasta, compania, producto, paramStart);

		JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AIN, request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AOUT, response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				opeEmitidaList = MsgFormatter.resMFGetOpeEmitidaList(response);
				getOpeEmitidaFillDes(opeEmitidaList);
				opeEmitidaInf.setParamStart(response.substring(
						MessageConstants.MSG_RES_COEL_INI - MessageConstants.MSG_REQ_COEL_PARAMSTART,
						MessageConstants.MSG_RES_COEL_INI).trim());
				opeEmitidaInf.setOpeEmitidaList(opeEmitidaList);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return opeEmitidaInf;
	}

	public ConClienteInf getConClienteList(final String tipoBusqueda, final Integer tipDoc, final String nroDoc,
			final String apellido, final Integer compania, final String poliza, final String paramStart) {
		JMSCommServiceImpl.logger.info("Ejecutando getConClienteList...");

		ConClienteInf conClienteInf = new ConClienteInf();
		List<ConCliente> conClienteList = null;
		String request = MsgFormatter.reqMFGetConClienteList(tipoBusqueda, tipDoc, nroDoc, apellido, compania, poliza,
				paramStart);

		JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AIN, request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AOUT, response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				conClienteList = MsgFormatter.resMFGetConClienteList(response);
				getConClienteFillDes(conClienteList);
				conClienteInf.setParamStart(response.substring(
						MessageConstants.MSG_RES_CCLL_INI - MessageConstants.MSG_REQ_CCLL_PARAMSTART,
						MessageConstants.MSG_RES_CCLL_INI).trim());
				conClienteInf.setConClienteList(conClienteList);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return conClienteInf;
	}

	public Cliente getConCliente(final Integer compania, final String poliza) {
		JMSCommServiceImpl.logger.info("Ejecutando getConCliente...");

		Cliente cliente = new Cliente();
		String request = MsgFormatter.reqMFGetConCliente(compania, poliza);

		JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AIN, request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AOUT, response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				cliente = MsgFormatter.resMFGetConCliente(response);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
				cliente = null;
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return cliente;
	}

	public Poliza getConPoliza(final Integer compania, final String npoliza, final Integer endoso) {
		JMSCommServiceImpl.logger.info("Ejecutando getConPoliza...");

		Poliza poliza = new Poliza();
		String request = MsgFormatter.reqMFGetConPoliza(compania, npoliza, endoso);

		JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AIN, request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AOUT, response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				poliza = MsgFormatter.resMFGetConPoliza(response);
				getConPolizaFillDes(compania, poliza);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
				poliza = null;
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return poliza;
	}

	public ConEndoso getConEndoso(final Integer compania, final String poliza, final Integer fechaDesde,
			final Integer fechaHasta) {
		JMSCommServiceImpl.logger.info("Ejecutando getConEndoso...");

		ConEndoso conEndoso = new ConEndoso();
		String request = MsgFormatter.reqMFGetConEndoso(compania, poliza, fechaDesde, fechaHasta);

		JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AIN, request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AOUT, response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				conEndoso = MsgFormatter.resMFGetConEndoso(response);
				getConEndosoFillDes(compania, conEndoso);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
				conEndoso = null;
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return conEndoso;
	}

	public ConSiniestroInf getConSiniestroList(final String tipoBusqueda, final Integer tipDoc, final String nroDoc,
			final String apellido, final String poliza, final String siniestro, final Long orden, final Integer compania,
			final String estado, final Integer fechaDesde, final Integer fechaHasta, final String paramStart) {
		JMSCommServiceImpl.logger.info("Ejecutando getConSiniestroList...");

		ConSiniestroInf conSiniestroInf = new ConSiniestroInf();
		List<ConSiniestro> conSiniestroList = null;
		String request = MsgFormatter.reqMFGetConSiniestroList(tipoBusqueda, tipDoc, nroDoc, apellido, poliza, siniestro,
				orden, compania, estado, fechaDesde, fechaHasta, paramStart);
		JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AIN, request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AOUT, response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				conSiniestroList = MsgFormatter.resMFGetConSiniestroList(response);
				getConSiniestroFillDes(conSiniestroList);
				conSiniestroInf.setParamStart(response.substring(
						MessageConstants.MSG_RES_CSIL_INI - MessageConstants.MSG_REQ_CSIL_paramStart,
						MessageConstants.MSG_RES_CSIL_INI).trim());
				conSiniestroInf.setConSiniestroList(conSiniestroList);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return conSiniestroInf;
	}

	public Siniestro getConSiniestro(final Integer compania, final String nsiniestro) {
		JMSCommServiceImpl.logger.info("Ejecutando getConSiniestro...");

		Siniestro siniestro = new Siniestro();
		String request = MsgFormatter.reqMFGetConSiniestro(compania, nsiniestro);

		JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AIN, request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AOUT, response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				siniestro = MsgFormatter.resMFGetConSiniestro(response);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
				siniestro = null;
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return siniestro;
	}

	public Denuncia getOpeSiniestro(final Long orden) {
		JMSCommServiceImpl.logger.info("Ejecutando getOpeSiniestro...");

		Denuncia denuncia = new Denuncia();
		String request = MsgFormatter.reqMFGetOpeSiniestro(orden);

		JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AIN, request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AOUT, response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				denuncia = MsgFormatter.resMFGetOpeSiniestro(response, orden);
				getOpeSiniestroFillDes(denuncia);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
				denuncia = null;
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return denuncia;
	}

	public Long setOpeSiniestro(final Denuncia denuncia) {
		JMSCommServiceImpl.logger.info("Ejecutando setOpeSiniestro...");

		Long orden = null;
		String request = MsgFormatter.reqMFSetOpeSiniestro(denuncia);

		JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AIN, request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AOUT, response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				orden = MsgFormatter.resMFSetOpeSiniestro(response);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
				orden = null;
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return orden;
	}

	public Boolean setOpeSiniestroEst(final Long orden, final String estado) {
		JMSCommServiceImpl.logger.info("Ejecutando setOpeSiniestroEst...");

		Boolean ret = false;
		String request = MsgFormatter.reqMFSetOpeSiniestroEst(orden, estado);

		JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AIN, request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AOUT, response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				ret = MsgFormatter.resMFSetOpeSiniestroEst(response);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return ret;
	}

	public OpeSiniestroInf getOpeSiniestroList(final String tipoBusqueda, final Integer tipDoc, final String nroDoc,
			final String apellido, final String poliza, final Long orden, final Integer compania, final String estado,
			final Integer fechaDesde, final Integer fechaHasta, final String paramStart) {
		JMSCommServiceImpl.logger.info("Ejecutando getOpeSiniestroList...");

		OpeSiniestroInf opeSiniestroInf = new OpeSiniestroInf();
		List<Denuncia> opeSiniestroList = null;
		String request = MsgFormatter.reqMFGetOpeSiniestroList(tipoBusqueda, tipDoc, nroDoc, apellido, poliza, orden,
				compania, estado, fechaDesde, fechaHasta, paramStart);
		JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AIN, request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info(JMSCommServiceImpl.C_AOUT, response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				opeSiniestroList = MsgFormatter.resMFGetOpeSiniestroList(response);
				getOpeSiniestroListFillDes(opeSiniestroList);
				opeSiniestroInf.setParamStart(response.substring(
						MessageConstants.MSG_RES_ODEL_INI - MessageConstants.MSG_REQ_ODEL_paramStart,
						MessageConstants.MSG_RES_ODEL_INI).trim());
				opeSiniestroInf.setDenunciaList(opeSiniestroList);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return opeSiniestroInf;
	}

	private void getOpeEmitidaFillDes(final List<OpeEmitida> opeEmitidaList) {
		List<Compania> companiaList = this.getParametersDao().getCompaniaList();
		// completa el nombre de la compania para op.emitidas
		if (opeEmitidaList != null) {
			for (int i = 0; i < opeEmitidaList.size(); i++) {
				String companiaDes = getCompaniaDes(companiaList, opeEmitidaList.get(i).getCompania().getId());
				opeEmitidaList.get(i).getCompania().setName(companiaDes);
			}
		}
	}

	private void getConClienteFillDes(final List<ConCliente> conClienteList) {
		List<Compania> companiaList = this.getParametersDao().getCompaniaList();
		// completa el nombre de la compania para consulta de clientes
		if (conClienteList != null) {
			for (int i = 0; i < conClienteList.size(); i++) {
				String companiaDes = getCompaniaDes(companiaList, conClienteList.get(i).getCompania().getId());
				conClienteList.get(i).getCompania().setName(companiaDes);
			}
		}
	}

	private void getConPolizaFillDes(final Integer compania, final Poliza poliza) {
		// completa los campos descripcion que faltan (producto, sucursal,
		// canal)
		if (poliza != null) {
			List<Producto> productoList = this.getProductoList(compania);
			String productoDes = getProductoDes(productoList, poliza.getProducto().getId());
			poliza.getProducto().setName(productoDes);
			List<Sucursal> sucursalList = this.getSucursalList(compania);
			String sucursalDes = getSucursalDes(sucursalList, poliza.getSucursal().getId());
			poliza.getSucursal().setName(sucursalDes);
			List<Canal> canalList = this.getCanalList(compania);
			String canalDes = getCanalDes(canalList, poliza.getCanal().getId());
			poliza.getCanal().setName(canalDes);

		}
	}

	private void getConEndosoFillDes(final Integer compania, final ConEndoso conEndoso) {
		// completa los campos descripcion que faltan (producto, sucursal,
		// canal)
		if (conEndoso != null) {
			List<Producto> productoList = this.getProductoList(compania);
			String productoDes = getProductoDes(productoList, conEndoso.getProducto().getId());
			conEndoso.getProducto().setName(productoDes);
			List<Sucursal> sucursalList = this.getSucursalList(compania);
			String sucursalDes = getSucursalDes(sucursalList, conEndoso.getSucursal().getId());
			conEndoso.getSucursal().setName(sucursalDes);
			List<Canal> canalList = this.getCanalList(compania);
			String canalDes = getCanalDes(canalList, conEndoso.getCanal().getId());
			conEndoso.getCanal().setName(canalDes);
		}
	}

	private void getConSiniestroFillDes(final List<ConSiniestro> conSiniestroList) {
		List<Compania> companiaList = this.getParametersDao().getCompaniaList();
		// completa el nombre de la compania para consulta de siniestros
		if (conSiniestroList != null) {
			for (int i = 0; i < conSiniestroList.size(); i++) {
				String companiaDes = getCompaniaDes(companiaList, conSiniestroList.get(i).getCompania().getId());
				conSiniestroList.get(i).getCompania().setName(companiaDes);
			}
		}
	}

	private void getOpeSiniestroFillDes(final Denuncia denuncia) {
		if (denuncia != null) {
			// completa el nombre de la compania, producto y parentesco para
			// consulta de denuncias
			List<Compania> companiaList = this.getParametersDao().getCompaniaList();
			String companiaDes = getCompaniaDes(companiaList, denuncia.getCompania().getId());
			denuncia.getCompania().setName(companiaDes);
			List<Producto> productoList = this.getProductoList(denuncia.getCompania().getId());
			String productoDes = getProductoDes(productoList, denuncia.getProducto().getId());
			denuncia.getProducto().setName(productoDes);
			List<Parentesco> parentescoList = this.getParametersDao().getParentescoList();
			String parentescoDes = getParentescoDes(parentescoList, denuncia.getDenParentesco().getId());
			denuncia.getDenParentesco().setName(parentescoDes);
		}
	}

	private void getOpeSiniestroListFillDes(final List<Denuncia> denunciaList) {
		List<Compania> companiaList = this.getParametersDao().getCompaniaList();
		// completa el nombre de la compania para consulta de denuncias
		if (denunciaList != null) {
			for (int i = 0; i < denunciaList.size(); i++) {
				String companiaDes = getCompaniaDes(companiaList, denunciaList.get(i).getCompania().getId());
				denunciaList.get(i).getCompania().setName(companiaDes);
			}
		}
	}

	private String getCompaniaDes(final List<Compania> companiaList, final Integer companiaId) {
		if (companiaList.size() > 0) {
			for (int i = 0; i < companiaList.size(); i++) {
				if (companiaList.get(i).getId().equals(companiaId)) {
					return companiaList.get(i).getName();
				}
			}
		}
		return "CIA. NO DEF.";
	}

	private String getProductoDes(final List<Producto> productoList, final String productoId) {
		if (productoList.size() > 0) {
			for (int i = 0; i < productoList.size(); i++) {
				if (productoList.get(i).getId().equalsIgnoreCase(productoId)) {
					return productoList.get(i).getName();
				}
			}
		}
		return "PROD. NO DEF.";
	}

	private String getSucursalDes(final List<Sucursal> sucursalList, final String sucursalId) {
		if (sucursalList.size() > 0) {
			for (int i = 0; i < sucursalList.size(); i++) {
				if (sucursalList.get(i).getId().equalsIgnoreCase(sucursalId)) {
					return sucursalList.get(i).getName();
				}
			}
		}
		return "SUC. NO DEF.";
	}

	private String getCanalDes(final List<Canal> canalList, final String canalId) {
		if (canalList.size() > 0) {
			for (int i = 0; i < canalList.size(); i++) {
				if (canalList.get(i).getId().equalsIgnoreCase(canalId)) {
					return canalList.get(i).getName();
				}
			}
		}
		return "CANAL. NO DEF.";
	}

	private String getParentescoDes(final List<Parentesco> parentescoList, final String parentescoId) {
		if (parentescoList.size() > 0) {
			for (int i = 0; i < parentescoList.size(); i++) {
				if (parentescoList.get(i).getId().equalsIgnoreCase(parentescoId)) {
					return parentescoList.get(i).getName();
				}
			}
		}
		return "CANAL. NO DEF.";
	}
}
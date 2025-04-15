/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.publicins.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.object.StoredProcedure;

import com.hsbc.hbar.publicins.dao.PublicadorDao;
import com.hsbc.hbar.publicins.model.pub.Banner;
import com.hsbc.hbar.publicins.model.pub.Destacado;
import com.hsbc.hbar.publicins.model.pub.Sitio;
import com.hsbc.hbar.publicins.model.pub.TAcceso;
import com.hsbc.hbar.publicins.service.utils.UtilFormat;

public class PublicadorDaoImpl implements PublicadorDao {
	private DataSource dataSource;

	public void setDataSource(final DataSource datasource) {
		this.dataSource = datasource;
	}

	public DataSource getDataSource() {
		return this.dataSource;
	}

	public List<Sitio> getSitioList() {
		P_PU_SITIOS_SEL sproc = new P_PU_SITIOS_SEL(this.dataSource);
		Map results = sproc.execute();
		return (List<Sitio>) results.get("Resultado");
	}

	public class P_PU_SITIOS_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_PU_SITIOS_SEL";

		public P_PU_SITIOS_SEL(final DataSource dataSource) {
			super(dataSource, P_PU_SITIOS_SEL.SPROC_NAME);
			declareParameter(new SqlReturnResultSet("Resultado",
					new RowMapper() {
						public Object mapRow(final ResultSet rs, final int cant)
								throws SQLException {
							return new Sitio(rs.getInt("SIT_IDE_SIT"),
									rs.getString("SIT_NOM_SIT"),
									rs.getString("SIT_URL_SIT"),
									rs.getInt("SIT_FEC_ALT"),
									rs.getInt("SIT_FEC_BAJ"), "");
						};
					}));
			compile();
		}

		public Map execute() {
			Map inputs = new HashMap();
			return super.execute(inputs);
		}
	}

	public String setSitio(final Integer id, final String nombre,
			final String url, final String usuario) {
		P_PU_SITIOS_IUD sproc = new P_PU_SITIOS_IUD(this.dataSource);
		Map results = sproc.execute(id, nombre, url, usuario);
		List<String> stringList = (List<String>) results.get("Resultado");
		return stringList.get(0);
	}

	public class P_PU_SITIOS_IUD extends StoredProcedure {
		private static final String SPROC_NAME = "P_PU_SITIOS_IUD";
		private static final String PARAM_IDE_SIT = "IDE_SIT";
		private static final String PARAM_NOM_SIT = "NOM_SIT";
		private static final String PARAM_URL_SIT = "URL_SIT";
		private static final String PARAM_COD_USU = "COD_USU";

		public P_PU_SITIOS_IUD(final DataSource dataSource) {
			super(dataSource, P_PU_SITIOS_IUD.SPROC_NAME);
			declareParameter(new SqlParameter(P_PU_SITIOS_IUD.PARAM_IDE_SIT,
					Types.INTEGER));
			declareParameter(new SqlParameter(P_PU_SITIOS_IUD.PARAM_NOM_SIT,
					Types.VARCHAR));
			declareParameter(new SqlParameter(P_PU_SITIOS_IUD.PARAM_URL_SIT,
					Types.VARCHAR));
			declareParameter(new SqlParameter(P_PU_SITIOS_IUD.PARAM_COD_USU,
					Types.VARCHAR));
			declareParameter(new SqlReturnResultSet("Resultado",
					new RowMapper() {
						public Object mapRow(final ResultSet rs, final int cant)
								throws SQLException {
							return new String(rs.getString("RESULT"));
						};
					}));
			compile();
		}

		public Map execute(final Integer id, final String nombre,
				final String url, final String usuario) {
			Map inputs = new HashMap();
			inputs.put(P_PU_SITIOS_IUD.PARAM_IDE_SIT, new Integer(id));
			inputs.put(P_PU_SITIOS_IUD.PARAM_NOM_SIT, new String(nombre));
			inputs.put(P_PU_SITIOS_IUD.PARAM_URL_SIT, new String(url));
			inputs.put(P_PU_SITIOS_IUD.PARAM_COD_USU, new String(usuario));
			return super.execute(inputs);
		}
	}

	public List<Destacado> getDestacadoList(final Integer id,
			final String traerVencidas) {
		P_PU_DESTACADOS_SEL sproc = new P_PU_DESTACADOS_SEL(this.dataSource);
		Map results = sproc.execute(id, traerVencidas);
		return (List<Destacado>) results.get("Resultado");
	}

	public class P_PU_DESTACADOS_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_PU_DESTACADOS_SEL";
		private static final String PARAM_IDE_DES = "IDE_DES";
		private static final String PARAM_TRA_VEN = "TRA_VEN";

		public P_PU_DESTACADOS_SEL(final DataSource dataSource) {
			super(dataSource, P_PU_DESTACADOS_SEL.SPROC_NAME);
			declareParameter(new SqlParameter(
					P_PU_DESTACADOS_SEL.PARAM_IDE_DES, Types.INTEGER));
			declareParameter(new SqlParameter(
					P_PU_DESTACADOS_SEL.PARAM_TRA_VEN, Types.VARCHAR));
			declareParameter(new SqlReturnResultSet("Resultado",
					new RowMapper() {
						public Object mapRow(final ResultSet rs, final int cant)
								throws SQLException {
							return new Destacado(rs.getInt("DES_IDE_DES"),
									rs.getString("DES_TIT_DES"),
									rs.getString("DES_SUB_TIT"),
									rs.getString("DES_DSC_DES"),
									rs.getString("DES_IMA_DES"),
									rs.getInt("DES_FEC_ALT"),
									rs.getInt("DES_FEC_DES"),
									rs.getInt("DES_FEC_HAS"),
									rs.getInt("DES_FEC_BAJ"),
									rs.getInt("DES_ROT_DES"),
									rs.getInt("DES_PUB_DES"), "",
									rs.getInt("DES_CAN_SIT"));
						};
					}));
			compile();
		}

		public Map execute(final Integer id, final String traerVencidas) {
			Map inputs = new HashMap();
			inputs.put(P_PU_DESTACADOS_SEL.PARAM_IDE_DES, new Integer(id));
			inputs.put(P_PU_DESTACADOS_SEL.PARAM_TRA_VEN, new String(
					traerVencidas));
			return super.execute(inputs);
		}
	}

	public String setDestacado(final Integer id, final String titulo,
			final String subtitulo, final String descripcion,
			final String imagen, final Integer fechaDesde,
			final Integer fechaHasta, final Integer rotacion,
			final Integer publicar, final String usuario) {
		P_PU_DESTACADOS_IUD sproc = new P_PU_DESTACADOS_IUD(this.dataSource);
		Map results = sproc.execute(id, titulo, subtitulo, descripcion, imagen,
				fechaDesde, fechaHasta, rotacion, publicar, usuario);
		List<String> stringList = (List<String>) results.get("Resultado");
		return stringList.get(0);
	}

	public class P_PU_DESTACADOS_IUD extends StoredProcedure {
		private static final String SPROC_NAME = "P_PU_DESTACADOS_IUD";
		private static final String PARAM_IDE_DES = "IDE_DES";
		private static final String PARAM_TIT_DES = "TIT_DES";
		private static final String PARAM_SUB_TIT = "SUB_TIT";
		private static final String PARAM_DSC_DES = "DSC_DES";
		private static final String PARAM_IMA_DES = "IMA_DES";
		private static final String PARAM_FEC_DES = "FEC_DES";
		private static final String PARAM_FEC_HAS = "FEC_HAS";
		private static final String PARAM_ROT_DES = "ROT_DES";
		private static final String PARAM_PUB_DES = "PUB_DES";
		private static final String PARAM_COD_USU = "COD_USU";

		public P_PU_DESTACADOS_IUD(final DataSource dataSource) {
			super(dataSource, P_PU_DESTACADOS_IUD.SPROC_NAME);
			declareParameter(new SqlParameter(
					P_PU_DESTACADOS_IUD.PARAM_IDE_DES, Types.INTEGER));
			declareParameter(new SqlParameter(
					P_PU_DESTACADOS_IUD.PARAM_TIT_DES, Types.VARCHAR));
			declareParameter(new SqlParameter(
					P_PU_DESTACADOS_IUD.PARAM_SUB_TIT, Types.VARCHAR));
			declareParameter(new SqlParameter(
					P_PU_DESTACADOS_IUD.PARAM_DSC_DES, Types.VARCHAR));
			declareParameter(new SqlParameter(
					P_PU_DESTACADOS_IUD.PARAM_IMA_DES, Types.VARCHAR));
			declareParameter(new SqlParameter(
					P_PU_DESTACADOS_IUD.PARAM_FEC_DES, Types.INTEGER));
			declareParameter(new SqlParameter(
					P_PU_DESTACADOS_IUD.PARAM_FEC_HAS, Types.INTEGER));
			declareParameter(new SqlParameter(
					P_PU_DESTACADOS_IUD.PARAM_ROT_DES, Types.SMALLINT));
			declareParameter(new SqlParameter(
					P_PU_DESTACADOS_IUD.PARAM_PUB_DES, Types.SMALLINT));
			declareParameter(new SqlParameter(
					P_PU_DESTACADOS_IUD.PARAM_COD_USU, Types.VARCHAR));
			declareParameter(new SqlReturnResultSet("Resultado",
					new RowMapper() {
						public Object mapRow(final ResultSet rs, final int cant)
								throws SQLException {
							return new String(rs.getString("RESULT"));
						};
					}));
			compile();
		}

		public Map execute(final Integer id, final String titulo,
				final String subtitulo, final String descripcion,
				final String imagen, final Integer fechaDesde,
				final Integer fechaHasta, final Integer rotacion,
				final Integer publicar, final String usuario) {
			Map inputs = new HashMap();
			inputs.put(P_PU_DESTACADOS_IUD.PARAM_IDE_DES, new Integer(id));
			inputs.put(P_PU_DESTACADOS_IUD.PARAM_TIT_DES,
					new String(UtilFormat.setSpecialChars(titulo)));
			inputs.put(P_PU_DESTACADOS_IUD.PARAM_SUB_TIT,
					new String(UtilFormat.setSpecialChars(subtitulo)));
			inputs.put(P_PU_DESTACADOS_IUD.PARAM_DSC_DES,
					new String(UtilFormat.setSpecialChars(descripcion)));
			inputs.put(P_PU_DESTACADOS_IUD.PARAM_IMA_DES, new String(imagen));
			inputs.put(P_PU_DESTACADOS_IUD.PARAM_FEC_DES, new Integer(
					fechaDesde));
			inputs.put(P_PU_DESTACADOS_IUD.PARAM_FEC_HAS, new Integer(
					fechaHasta));
			inputs.put(P_PU_DESTACADOS_IUD.PARAM_ROT_DES, new Integer(rotacion));
			inputs.put(P_PU_DESTACADOS_IUD.PARAM_PUB_DES, new Integer(publicar));
			inputs.put(P_PU_DESTACADOS_IUD.PARAM_COD_USU, new String(usuario));
			return super.execute(inputs);
		}
	}

	public List<Sitio> getSitioXDestacadoList(final Integer id) {
		P_PU_DESTXSITIO_SEL sproc = new P_PU_DESTXSITIO_SEL(this.dataSource);
		Map results = sproc.execute(id);
		return (List<Sitio>) results.get("Resultado");
	}

	public class P_PU_DESTXSITIO_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_PU_DESTXSITIO_SEL";
		private static final String PARAM_IDE_DES = "IDE_DES";

		public P_PU_DESTXSITIO_SEL(final DataSource dataSource) {
			super(dataSource, P_PU_DESTXSITIO_SEL.SPROC_NAME);
			declareParameter(new SqlParameter(
					P_PU_DESTXSITIO_SEL.PARAM_IDE_DES, Types.INTEGER));
			declareParameter(new SqlReturnResultSet("Resultado",
					new RowMapper() {
						public Object mapRow(final ResultSet rs, final int cant)
								throws SQLException {
							return new Sitio(rs.getInt("DXS_IDE_SIT"),
									rs.getString("DXS_NOM_SIT"),
									rs.getInt("DXS_IDE_REL") > 0 ? "A" : "N",
									rs.getInt("DXS_IDE_REL"), 0, "");
						};
					}));
			compile();
		}

		public Map execute(final Integer id) {
			Map inputs = new HashMap();
			inputs.put(P_PU_DESTXSITIO_SEL.PARAM_IDE_DES, new Integer(id));
			return super.execute(inputs);
		}
	}

	public String setSitioXDestacado(final Integer idRel,
			final Integer idSitio, final Integer idDestacado,
			final String usuario) {
		P_PU_DESTXSITIO_IUD sproc = new P_PU_DESTXSITIO_IUD(this.dataSource);
		Map results = sproc.execute(idRel, idSitio, idDestacado, usuario);
		List<String> stringList = (List<String>) results.get("Resultado");
		return stringList.get(0);
	}

	public class P_PU_DESTXSITIO_IUD extends StoredProcedure {
		private static final String SPROC_NAME = "P_PU_DESTXSITIO_IUD";
		private static final String PARAM_IDE_REL = "IDE_REL";
		private static final String PARAM_IDE_SIT = "IDE_SIT";
		private static final String PARAM_IDE_DES = "IDE_DES";
		private static final String PARAM_COD_USU = "COD_USU";

		public P_PU_DESTXSITIO_IUD(final DataSource dataSource) {
			super(dataSource, P_PU_DESTXSITIO_IUD.SPROC_NAME);
			declareParameter(new SqlParameter(
					P_PU_DESTXSITIO_IUD.PARAM_IDE_REL, Types.INTEGER));
			declareParameter(new SqlParameter(
					P_PU_DESTXSITIO_IUD.PARAM_IDE_SIT, Types.INTEGER));
			declareParameter(new SqlParameter(
					P_PU_DESTXSITIO_IUD.PARAM_IDE_DES, Types.INTEGER));
			declareParameter(new SqlParameter(
					P_PU_DESTXSITIO_IUD.PARAM_COD_USU, Types.VARCHAR));
			declareParameter(new SqlReturnResultSet("Resultado",
					new RowMapper() {
						public Object mapRow(final ResultSet rs, final int cant)
								throws SQLException {
							return new String(rs.getString("RESULT"));
						};
					}));
			compile();
		}

		public Map execute(final Integer idRel, final Integer idSitio,
				final Integer idDestacado, final String usuario) {
			Map inputs = new HashMap();
			inputs.put(P_PU_DESTXSITIO_IUD.PARAM_IDE_REL, new Integer(idRel));
			inputs.put(P_PU_DESTXSITIO_IUD.PARAM_IDE_SIT, new Integer(idSitio));
			inputs.put(P_PU_DESTXSITIO_IUD.PARAM_IDE_DES, new Integer(
					idDestacado));
			inputs.put(P_PU_DESTXSITIO_IUD.PARAM_COD_USU, new String(usuario));
			return super.execute(inputs);
		}
	}

	public List<Banner> getBannerList(final Integer id,
			final String traerVencidas) {
		P_PU_BANNERS_SEL sproc = new P_PU_BANNERS_SEL(this.dataSource);
		Map results = sproc.execute(id, traerVencidas);
		return (List<Banner>) results.get("Resultado");
	}

	public class P_PU_BANNERS_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_PU_BANNERS_SEL";
		private static final String PARAM_IDE_BAN = "IDE_BAN";
		private static final String PARAM_TRA_VEN = "TRA_VEN";

		public P_PU_BANNERS_SEL(final DataSource dataSource) {
			super(dataSource, P_PU_BANNERS_SEL.SPROC_NAME);
			declareParameter(new SqlParameter(P_PU_BANNERS_SEL.PARAM_IDE_BAN,
					Types.INTEGER));
			declareParameter(new SqlParameter(P_PU_BANNERS_SEL.PARAM_TRA_VEN,
					Types.VARCHAR));
			declareParameter(new SqlReturnResultSet("Resultado",
					new RowMapper() {
						public Object mapRow(final ResultSet rs, final int cant)
								throws SQLException {
							return new Banner(rs.getInt("BAN_IDE_BAN"),
									rs.getString("BAN_TIT_BAN"),
									rs.getString("BAN_IMA_BAN"),
									rs.getInt("BAN_LNK_TIE"),
									rs.getInt("BAN_LNK_DES"),
									rs.getInt("BAN_LNK_IDS"),
									rs.getString("BAN_LNK_URL"),
									rs.getInt("BAN_PUP_TIE"),
									rs.getString("BAN_PUP_SCB"),
									rs.getString("BAN_PUP_TLB"),
									rs.getString("BAN_PUP_RES"),
									rs.getInt("BAN_PUP_WID"),
									rs.getInt("BAN_PUP_HEI"),
									rs.getInt("BAN_PUP_TOP"),
									rs.getInt("BAN_PUP_LEF"),
									rs.getInt("BAN_UBI_BAN"),
									rs.getInt("BAN_POS_BAN"),
									rs.getInt("BAN_FEC_ALT"),
									rs.getInt("BAN_FEC_DES"),
									rs.getInt("BAN_FEC_HAS"),
									rs.getInt("BAN_FEC_BAJ"),
									rs.getInt("BAN_PUB_BAN"), "",
									rs.getInt("BAN_CAN_SIT"));
						};
					}));
			compile();
		}

		public Map execute(final Integer id, final String traerVencidas) {
			Map inputs = new HashMap();
			inputs.put(P_PU_BANNERS_SEL.PARAM_IDE_BAN, new Integer(id));
			inputs.put(P_PU_BANNERS_SEL.PARAM_TRA_VEN,
					new String(traerVencidas));
			return super.execute(inputs);
		}
	}

	public String setBanner(final Integer id, final String titulo,
			final String imagen, final Integer linkTiene,
			final Integer linkRelDestacado, final Integer linkIdDestacado,
			final String linkURL, final Integer popUpTiene,
			final String popUpScrollbar, final String popUpToolbar,
			final String popUpResizable, final Integer popUpWidth,
			final Integer popUpHeight, final Integer popUpTop,
			final Integer popUpLeft, final Integer ubicacion,
			final Integer orden, final Integer fechaDesde,
			final Integer fechaHasta, final Integer publicar,
			final String usuario) {
		P_PU_BANNERS_IUD sproc = new P_PU_BANNERS_IUD(this.dataSource);
		Map results = sproc.execute(id, titulo, imagen, linkTiene,
				linkRelDestacado, linkIdDestacado, linkURL, popUpTiene,
				popUpScrollbar, popUpToolbar, popUpResizable, popUpWidth,
				popUpHeight, popUpTop, popUpLeft, ubicacion, orden, fechaDesde,
				fechaHasta, publicar, usuario);
		List<String> stringList = (List<String>) results.get("Resultado");
		return stringList.get(0);
	}

	public class P_PU_BANNERS_IUD extends StoredProcedure {
		private static final String SPROC_NAME = "P_PU_BANNERS_IUD";
		private static final String PARAM_IDE_BAN = "IDE_BAN";
		private static final String PARAM_TIT_BAN = "TIT_BAN";
		private static final String PARAM_IMA_BAN = "IMA_BAN";
		private static final String PARAM_LNK_TIE = "LNK_TIE";
		private static final String PARAM_LNK_DES = "LNK_DES";
		private static final String PARAM_LNK_IDS = "LNK_IDS";
		private static final String PARAM_LNK_URL = "LNK_URL";
		private static final String PARAM_PUP_TIE = "PUP_TIE";
		private static final String PARAM_PUP_SCB = "PUP_SCB";
		private static final String PARAM_PUP_TLB = "PUP_TLB";
		private static final String PARAM_PUP_RES = "PUP_RES";
		private static final String PARAM_PUP_WID = "PUP_WID";
		private static final String PARAM_PUP_HEI = "PUP_HEI";
		private static final String PARAM_PUP_TOP = "PUP_TOP";
		private static final String PARAM_PUP_LEF = "PUP_LEF";
		private static final String PARAM_UBI_BAN = "UBI_BAN";
		private static final String PARAM_POS_BAN = "POS_BAN";
		private static final String PARAM_FEC_DES = "FEC_DES";
		private static final String PARAM_FEC_HAS = "FEC_HAS";
		private static final String PARAM_PUB_BAN = "PUB_BAN";
		private static final String PARAM_COD_USU = "COD_USU";

		public P_PU_BANNERS_IUD(final DataSource dataSource) {
			super(dataSource, P_PU_BANNERS_IUD.SPROC_NAME);
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_IDE_BAN,
					Types.INTEGER));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_TIT_BAN,
					Types.VARCHAR));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_IMA_BAN,
					Types.VARCHAR));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_LNK_TIE,
					Types.INTEGER));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_LNK_DES,
					Types.INTEGER));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_LNK_IDS,
					Types.INTEGER));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_LNK_URL,
					Types.VARCHAR));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_PUP_TIE,
					Types.INTEGER));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_PUP_SCB,
					Types.VARCHAR));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_PUP_TLB,
					Types.VARCHAR));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_PUP_RES,
					Types.VARCHAR));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_PUP_WID,
					Types.INTEGER));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_PUP_HEI,
					Types.INTEGER));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_PUP_TOP,
					Types.INTEGER));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_PUP_LEF,
					Types.INTEGER));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_UBI_BAN,
					Types.INTEGER));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_POS_BAN,
					Types.INTEGER));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_FEC_DES,
					Types.INTEGER));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_FEC_HAS,
					Types.INTEGER));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_PUB_BAN,
					Types.SMALLINT));
			declareParameter(new SqlParameter(P_PU_BANNERS_IUD.PARAM_COD_USU,
					Types.VARCHAR));
			declareParameter(new SqlReturnResultSet("Resultado",
					new RowMapper() {
						public Object mapRow(final ResultSet rs, final int cant)
								throws SQLException {
							return new String(rs.getString("RESULT"));
						};
					}));
			compile();
		}

		public Map execute(final Integer id, final String titulo,
				final String imagen, final Integer linkTiene,
				final Integer linkRelDestacado, final Integer linkIdDestacado,
				final String linkURL, final Integer popUpTiene,
				final String popUpScrollbar, final String popUpToolbar,
				final String popUpResizable, final Integer popUpWidth,
				final Integer popUpHeight, final Integer popUpTop,
				final Integer popUpLeft, final Integer ubicacion,
				final Integer orden, final Integer fechaDesde,
				final Integer fechaHasta, final Integer publicar,
				final String usuario) {
			Map inputs = new HashMap();
			inputs.put(P_PU_BANNERS_IUD.PARAM_IDE_BAN, new Integer(id));
			inputs.put(P_PU_BANNERS_IUD.PARAM_TIT_BAN,
					new String(UtilFormat.setSpecialChars(titulo)));
			inputs.put(P_PU_BANNERS_IUD.PARAM_IMA_BAN, new String(imagen));
			inputs.put(P_PU_BANNERS_IUD.PARAM_LNK_TIE, new Integer(linkTiene));
			inputs.put(P_PU_BANNERS_IUD.PARAM_LNK_DES, new Integer(
					linkRelDestacado));
			inputs.put(P_PU_BANNERS_IUD.PARAM_LNK_IDS, new Integer(
					linkIdDestacado));
			inputs.put(P_PU_BANNERS_IUD.PARAM_LNK_URL, new String(linkURL));
			inputs.put(P_PU_BANNERS_IUD.PARAM_PUP_TIE, new Integer(popUpTiene));
			inputs.put(P_PU_BANNERS_IUD.PARAM_PUP_SCB, new String(
					popUpScrollbar));
			inputs.put(P_PU_BANNERS_IUD.PARAM_PUP_TLB, new String(popUpToolbar));
			inputs.put(P_PU_BANNERS_IUD.PARAM_PUP_RES, new String(
					popUpResizable));
			inputs.put(P_PU_BANNERS_IUD.PARAM_PUP_WID, new Integer(popUpWidth));
			inputs.put(P_PU_BANNERS_IUD.PARAM_PUP_HEI, new Integer(popUpHeight));
			inputs.put(P_PU_BANNERS_IUD.PARAM_PUP_TOP, new Integer(popUpTop));
			inputs.put(P_PU_BANNERS_IUD.PARAM_PUP_LEF, new Integer(popUpLeft));
			inputs.put(P_PU_BANNERS_IUD.PARAM_UBI_BAN, new Integer(ubicacion));
			inputs.put(P_PU_BANNERS_IUD.PARAM_POS_BAN, new Integer(orden));
			inputs.put(P_PU_BANNERS_IUD.PARAM_FEC_DES, new Integer(fechaDesde));
			inputs.put(P_PU_BANNERS_IUD.PARAM_FEC_HAS, new Integer(fechaHasta));
			inputs.put(P_PU_BANNERS_IUD.PARAM_PUB_BAN, new Integer(publicar));
			inputs.put(P_PU_BANNERS_IUD.PARAM_COD_USU, new String(usuario));

			return super.execute(inputs);
		}
	}

	public List<Sitio> getSitioXBannerList(final Integer id) {
		P_PU_BANNXSITIO_SEL sproc = new P_PU_BANNXSITIO_SEL(this.dataSource);
		Map results = sproc.execute(id);
		return (List<Sitio>) results.get("Resultado");
	}

	public class P_PU_BANNXSITIO_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_PU_BANNXSITIO_SEL";
		private static final String PARAM_IDE_BAN = "IDE_BAN";

		public P_PU_BANNXSITIO_SEL(final DataSource dataSource) {
			super(dataSource, P_PU_BANNXSITIO_SEL.SPROC_NAME);
			declareParameter(new SqlParameter(
					P_PU_BANNXSITIO_SEL.PARAM_IDE_BAN, Types.INTEGER));
			declareParameter(new SqlReturnResultSet("Resultado",
					new RowMapper() {
						public Object mapRow(final ResultSet rs, final int cant)
								throws SQLException {
							return new Sitio(rs.getInt("BXS_IDE_SIT"),
									rs.getString("BXS_NOM_SIT"),
									rs.getInt("BXS_IDE_REL") > 0 ? "A" : "N",
									rs.getInt("BXS_IDE_REL"), 0, "");
						};
					}));
			compile();
		}

		public Map execute(final Integer id) {
			Map inputs = new HashMap();
			inputs.put(P_PU_BANNXSITIO_SEL.PARAM_IDE_BAN, new Integer(id));
			return super.execute(inputs);
		}
	}

	public String setSitioXBanner(final Integer idRel, final Integer idSitio,
			final Integer idBanner, final String usuario) {
		P_PU_BANNXSITIO_IUD sproc = new P_PU_BANNXSITIO_IUD(this.dataSource);
		Map results = sproc.execute(idRel, idSitio, idBanner, usuario);
		List<String> stringList = (List<String>) results.get("Resultado");
		return stringList.get(0);
	}

	public class P_PU_BANNXSITIO_IUD extends StoredProcedure {
		private static final String SPROC_NAME = "P_PU_BANNXSITIO_IUD";
		private static final String PARAM_IDE_REL = "IDE_REL";
		private static final String PARAM_IDE_SIT = "IDE_SIT";
		private static final String PARAM_IDE_DES = "IDE_DES";
		private static final String PARAM_COD_USU = "COD_USU";

		public P_PU_BANNXSITIO_IUD(final DataSource dataSource) {
			super(dataSource, P_PU_BANNXSITIO_IUD.SPROC_NAME);
			declareParameter(new SqlParameter(
					P_PU_BANNXSITIO_IUD.PARAM_IDE_REL, Types.INTEGER));
			declareParameter(new SqlParameter(
					P_PU_BANNXSITIO_IUD.PARAM_IDE_SIT, Types.INTEGER));
			declareParameter(new SqlParameter(
					P_PU_BANNXSITIO_IUD.PARAM_IDE_DES, Types.INTEGER));
			declareParameter(new SqlParameter(
					P_PU_BANNXSITIO_IUD.PARAM_COD_USU, Types.VARCHAR));
			declareParameter(new SqlReturnResultSet("Resultado",
					new RowMapper() {
						public Object mapRow(final ResultSet rs, final int cant)
								throws SQLException {
							return new String(rs.getString("RESULT"));
						};
					}));
			compile();
		}

		public Map execute(final Integer idRel, final Integer idSitio,
				final Integer idBanner, final String usuario) {
			Map inputs = new HashMap();
			inputs.put(P_PU_BANNXSITIO_IUD.PARAM_IDE_REL, new Integer(idRel));
			inputs.put(P_PU_BANNXSITIO_IUD.PARAM_IDE_SIT, new Integer(idSitio));
			inputs.put(P_PU_BANNXSITIO_IUD.PARAM_IDE_DES, new Integer(idBanner));
			inputs.put(P_PU_BANNXSITIO_IUD.PARAM_COD_USU, new String(usuario));
			return super.execute(inputs);
		}
	}

	public List<TAcceso> getTAccesoList(final Integer id) {
		P_PU_TACCESO_SEL sproc = new P_PU_TACCESO_SEL(this.dataSource);
		Map results = sproc.execute(id);
		return (List<TAcceso>) results.get("Resultado");
	}

	public class P_PU_TACCESO_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_PU_TACCESO_SEL";
		private static final String PARAM_IDE_TAC = "IDE_TAC";

		public P_PU_TACCESO_SEL(final DataSource dataSource) {
			super(dataSource, P_PU_TACCESO_SEL.SPROC_NAME);
			declareParameter(new SqlParameter(P_PU_TACCESO_SEL.PARAM_IDE_TAC,
					Types.INTEGER));
			declareParameter(new SqlReturnResultSet("Resultado",
					new RowMapper() {
						public Object mapRow(final ResultSet rs, final int cant)
								throws SQLException {
							return new TAcceso(rs.getInt("TAC_IDE_TAC"),
									rs.getString("TAC_NOM_TAC"),
									rs.getString("TAC_CLI_TIP"),
									rs.getInt("TAC_IDE_SIT"),
									rs.getInt("TAC_FEC_ALT"),
									rs.getInt("TAC_FEC_BAJ"), "");
						};
					}));
			compile();
		}

		public Map execute(final Integer id) {
			Map inputs = new HashMap();
			inputs.put(P_PU_TACCESO_SEL.PARAM_IDE_TAC, new Integer(id));
			return super.execute(inputs);
		}
	}

	public String setTAcceso(final Integer id, final String nombre,
			final String tipo, final Integer idSitio, final String usuario) {
		P_PU_TACCESO_IUD sproc = new P_PU_TACCESO_IUD(this.dataSource);
		Map results = sproc.execute(id, nombre, tipo, idSitio, usuario);
		List<String> stringList = (List<String>) results.get("Resultado");
		return stringList.get(0);
	}

	public class P_PU_TACCESO_IUD extends StoredProcedure {
		private static final String SPROC_NAME = "P_PU_TACCESO_IUD";
		private static final String PARAM_IDE_TAC = "IDE_TAC";
		private static final String PARAM_NOM_TAC = "NOM_TAC";
		private static final String PARAM_CLI_TIP = "CLI_TIP";
		private static final String PARAM_IDE_SIT = "IDE_SIT";
		private static final String PARAM_COD_USU = "COD_USU";

		public P_PU_TACCESO_IUD(final DataSource dataSource) {
			super(dataSource, P_PU_TACCESO_IUD.SPROC_NAME);
			declareParameter(new SqlParameter(P_PU_TACCESO_IUD.PARAM_IDE_TAC,
					Types.INTEGER));
			declareParameter(new SqlParameter(P_PU_TACCESO_IUD.PARAM_NOM_TAC,
					Types.VARCHAR));
			declareParameter(new SqlParameter(P_PU_TACCESO_IUD.PARAM_CLI_TIP,
					Types.VARCHAR));
			declareParameter(new SqlParameter(P_PU_TACCESO_IUD.PARAM_IDE_SIT,
					Types.INTEGER));
			declareParameter(new SqlParameter(P_PU_TACCESO_IUD.PARAM_COD_USU,
					Types.VARCHAR));
			declareParameter(new SqlReturnResultSet("Resultado",
					new RowMapper() {
						public Object mapRow(final ResultSet rs, final int cant)
								throws SQLException {
							return new String(rs.getString("RESULT"));
						};
					}));
			compile();
		}

		public Map execute(final Integer id, final String nombre,
				final String tipo, final Integer idSitio, final String usuario) {
			Map inputs = new HashMap();
			inputs.put(P_PU_TACCESO_IUD.PARAM_IDE_TAC, new Integer(id));
			inputs.put(P_PU_TACCESO_IUD.PARAM_NOM_TAC, new String(nombre));
			inputs.put(P_PU_TACCESO_IUD.PARAM_CLI_TIP, new String(tipo));
			inputs.put(P_PU_TACCESO_IUD.PARAM_IDE_SIT, new Integer(idSitio));
			inputs.put(P_PU_TACCESO_IUD.PARAM_COD_USU, new String(usuario));
			return super.execute(inputs);
		}
	}
}
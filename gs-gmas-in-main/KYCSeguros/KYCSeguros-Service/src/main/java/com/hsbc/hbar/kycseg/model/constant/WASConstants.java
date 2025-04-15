/*
--------------------------------------------------------------------------------
COPYRIGHT. THE HONGKONG AND SHANGHAI BANKING CORPORATION
LIMITED 2013. ALL RIGHTS RESERVED

This software is only to be used for the purpose for which it has been provided.
No part of it is to be reproduced, disassembled, transmitted, stored in a retrieval
system or translated in any human or computer language in any way or for any other
purposes whatsoever without the prior written consent of the Hong Kong and Shanghai
Banking Corporation Limited. Infringement of copyright is a serious civil and criminal
offence, which can result in heavy fines and payment of substantial damages.
--------------------------------------------------------------------------------
 */
package com.hsbc.hbar.kycseg.model.constant;

/**
 * <p>
 * <b> Insert description of the class's responsibility/role. </b>
 * </p>
 */
public final class WASConstants {
	// End Points (MW)
	public static final String ENDPOINT_SEGMAX = System
			.getProperty("insurance.ENDPOINT_MDW");
	public static final String ENDPOINT_SHARED_SERVICES = System
			.getProperty("insurance.ENDPOINT_SHA ");
	// Key OVNYL
	public static final String WC_OVNYL_KEY = System
			.getProperty("insurance.OVNYL_KEY");
}

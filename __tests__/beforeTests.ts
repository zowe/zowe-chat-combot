/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

jest.setTimeout(50000);

if (process.env.TEST_DEBUG === 'true') {
  process.env = {
    ...process.env,
    COMMONBOT_LOG_CONSOLE_SILENT: 'false',
    COMMONBOT_LOG_LEVEL: 'debug',
    COMMONBOT_LOG_FILE_PATH: './__tests__/__results__',
  };
}

import { register, login } from "./auth.controller";
import { getProfile } from "./profile.controller";
import {
  uploadFiles,
  grantPermissions,
  getFile,
  downloadLatest,
  getFileVersions,
  downloadSpecificVersion,
} from "./file.controller";
import { prometheusMetrics } from "./prometheus.controller";

export {
  register,
  login,
  getProfile,
  uploadFiles,
  grantPermissions,
  getFile,
  downloadLatest,
  getFileVersions,
  downloadSpecificVersion,
  prometheusMetrics,
};

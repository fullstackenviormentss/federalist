import federalist from '../util/federalistApi';
import github from '../util/githubApi';
import { siteActionTypes } from '../constants';
import store from '../store';

export default {
  fetchSites() {
    federalist.fetchSites().then((sites) => {
      store.dispatch({
        type: siteActionTypes.SITES_RECEIVED,
        sites
      });
    });
  },

  addSite(siteToAdd) {
    federalist.addSite(siteToAdd).then((site) => {
      store.dispatch({
        type: siteActionTypes.SITE_ADDED,
        site
      });
    });
  },

  deleteSite(siteId) {
    federalist.deleteSite(siteId);
  },

  deletedSite(siteId) {
    store.dispatch({
      type: siteActionTypes.SITE_DELETED,
      siteId
    });
  },

  fetchSiteAssets(site) {
    const config = site['_config.yml'];
    const assetPath = (config && config.assetPath) || 'assets';
    github.fetchRepositoryContent(site, assetPath).then((assets) => {
      return assets.filter((a) => {
        return a.type === 'file';
      });
    }).then((assets) => {
      store.dispatch({
        type: siteActionTypes.SITE_ASSETS_RECEIVED,
        siteId: site.id,
        assets
      });
    });
  },

  fetchSiteConfigs(site) {
    github.fetchRepositoryConfigs(site).then((configs) => {
      store.dispatch({
        type: siteActionTypes.SITE_CONFIGS_RECEIVED,
        siteId: site.id,
        configs
      });
    });
  }
}

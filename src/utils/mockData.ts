import Papa from 'papaparse';
import { HouseData, PopulationData, FacilityData } from '../types';

// Mock data content directly inline since reading from file might have async issues in simple setup
const mockHouseCSV = `id,group,owner,area,status,structure
新华村-一组-001,一组,张建国,120,自住,砖混
新华村-一组-002,一组,李明,80,空置,土木
新华村-一组-003,一组,王秀英,150,自住,砖混
新华村-二组-001,二组,赵铁柱,200,出租,砖混
新华村-二组-002,二组,刘大爷,90,危房,土木
新华村-三组-001,三组,孙小强,110,自住,砖木
新华村-三组-002,三组,周伯通,160,闲置,砖混
新华村-三组-003,三组,吴刚,140,自住,砖混`;

const mockPopulationCSV = `name,gender,age,idCard,phone,houseId,label,healthStatus
张建国,男,52,4201011974****1234,13800138001,新华村-一组-001,常住村民,健康
刘翠花,女,50,4201011976****5678,13900139002,新华村-一组-001,常住村民,健康
李明,男,30,4201011996****8765,13700137003,新华村-一组-002,外出务工,健康
王秀英,女,78,4201011948****4321,13600136004,新华村-一组-003,独居老人,高血压
赵铁柱,男,45,4201011981****1111,13500135005,新华村-二组-001,常住村民,健康
张三(租客),男,28,4301011998****2222,13400134006,新华村-二组-001,外来人口,健康
刘大爷,男,82,4201011944****3333,无手机,新华村-二组-002,五保户,行动不便
孙小强,男,8,4201012018****4444,无手机,新华村-三组-001,留守儿童,健康
吴刚,男,40,4201011986****5555,13300133007,新华村-三组-003,村干部/网格员,健康`;

const mockFacilityCSV = `name,category,id,manager,phone,status,issueDesc
新华村卫生室,公共设施,新华村-一组-004,李大夫,13800138008,正常,无
李记农家乐,小微企业,新华村-一组-005,李老板,13900139009,需整改,后厨液化气罐无安全阀
东头池塘防溺水点,安全设施,新华村-二组-水域01,吴刚(村干部),13300133007,正常,警示牌完好
红薯种植合作社,农业单位,新华村-三组-004,赵铁柱,13500135005,正常,无
村口垃圾转运站,环卫设施,新华村-村口-001,王保洁,13000130001,需清理,垃圾满溢
微型消防站,消防设施,新华村-村委会-001,吴刚(村干部),13300133007,需整改,灭火器过期`;

export const getHouses = (): HouseData[] => {
  const result = Papa.parse(mockHouseCSV, { header: true, dynamicTyping: true });
  return result.data as HouseData[];
};

export const getPopulation = (): PopulationData[] => {
  const result = Papa.parse(mockPopulationCSV, { header: true, dynamicTyping: true });
  return result.data as PopulationData[];
};

export const getFacilities = (): FacilityData[] => {
  const result = Papa.parse(mockFacilityCSV, { header: true, dynamicTyping: true });
  return result.data as FacilityData[];
};
